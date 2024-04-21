import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, args: any): any {
    /* if no filters return value as is */
    if (!args) {
      return value;
    }

    let modifiedValue = value;

    /* remove all specific special characters and replace with greedy special characters */
    let partialRegex = args.trim().toUpperCase().replace(/[^A-Za-z0-9 ]/g, "").replace(/\s\s+/g, ' ').split("").join("[^A-Za-z0-9 ]*");
    let partialRegexPattern = new RegExp(`(?=(${partialRegex}))`, "gi");

    let partialMatch;
    let allPartialMatchedBlocks = [];

    /* find all blocks where the regex matched in the value */
    while ((partialMatch = partialRegexPattern.exec(value)) !== null) {

      allPartialMatchedBlocks.push({ start: partialMatch.index, end: partialMatch[1].length + partialMatch.index - 1, idx: 0, type: "partial" });

      if (partialRegexPattern.lastIndex === partialMatch.index) {
        partialRegexPattern.lastIndex++;
      }

    }

    /* collapse and merge overlapping partial blocks */
    let mergedPartialMatchedBlocks = this.collapseAndMergeBlocks(allPartialMatchedBlocks);

    /* escape all regex special characters and leave everything as is */
    let exactRegex = args.toUpperCase().replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    let exactRegexPattern = new RegExp(`(?=(${exactRegex}))`, "gi");

    let exactMatch;
    let allExactMatchedBlocks = [];

    /* find all blocks where the regex matched in the value */
    while ((exactMatch = exactRegexPattern.exec(value)) !== null) {

      allExactMatchedBlocks.push({ start: exactMatch.index, end: exactMatch[1].length + exactMatch.index - 1, idx: 0, type: "exact" });

      if (exactRegexPattern.lastIndex === exactMatch.index) {
        exactRegexPattern.lastIndex++;
      }
    }

    /* collapse and merge overlapping exact blocks */
    let mergedExactMatchedBlocks = this.collapseAndMergeBlocks(allExactMatchedBlocks);

    /* give precedence to exact blocks over partial blocks if matched to the same indices */
    if (mergedExactMatchedBlocks.length != 0 && mergedPartialMatchedBlocks.length != 0) {
      for(let exactMatchedBlock of mergedExactMatchedBlocks){

        let tempPartialBlocks:{ start: number, end: number, idx: number, type: string }[] = [];

        for(let partialMatchedBlock of mergedPartialMatchedBlocks){
          /* not overlapping the exactMatchBlock, no change to existing partialMatchBlock */
          if(partialMatchedBlock.start > exactMatchedBlock.end || partialMatchedBlock.end < exactMatchedBlock.start){
            tempPartialBlocks.push(partialMatchedBlock);
            continue;
          }
          /* fully overlapped by the exactMatchBlock, remove it from consideration */
          if(partialMatchedBlock.start >= exactMatchedBlock.start && partialMatchedBlock.end <= exactMatchedBlock.end ){
            continue;
          }
          /* partially overlapped at the left */
          if(partialMatchedBlock.start >= exactMatchedBlock.start){
            tempPartialBlocks.push({ start: exactMatchedBlock.end + 1, end: partialMatchedBlock.end, idx: partialMatchedBlock.idx, type: "partial" });
            continue;
          }
          /* partially overlapped at the right */
          if(partialMatchedBlock.end <= exactMatchedBlock.end){
            tempPartialBlocks.push({ start: partialMatchedBlock.start , end: exactMatchedBlock.start-1, idx: partialMatchedBlock.idx, type: "partial" });
            continue;
          }

          /* partially overlapped leaving both right and left */
          if(partialMatchedBlock.start < exactMatchedBlock.start && partialMatchedBlock.end > exactMatchedBlock.end){
            tempPartialBlocks.push({ start: partialMatchedBlock.start , end: exactMatchedBlock.start-1, idx: partialMatchedBlock.idx, type: "partial" });
            tempPartialBlocks.push({ start: exactMatchedBlock.end+1 , end: partialMatchedBlock.end, idx: partialMatchedBlock.idx, type: "partial" });
            continue;
          }

        }

        mergedPartialMatchedBlocks = tempPartialBlocks;
      }
    }

    /* combine all matched blocks and then sort according to start */
    let allMatchedBlocks = [...mergedPartialMatchedBlocks, ...mergedExactMatchedBlocks];
    allMatchedBlocks.sort(function (blockA, blockB) {
      if (blockA.start < blockB.start) {
        return -1;
      }
      if (blockA.start > blockB.start) {
        return 1;
      }
      return 0;
    })

    /* can only highlight if there are blocks */
    if (allMatchedBlocks.length > 0) {

      let highlightedValue = '';
      let currentEnd = 0;
      for (let block of allMatchedBlocks) {
        if (block.start != currentEnd) {
          highlightedValue += modifiedValue.substring(currentEnd, block.start);
        }
        highlightedValue += `<span class = "${block.type}-match">${modifiedValue.substring(block.start, block.end + 1)}</span>`;
        currentEnd = block.end + 1;
      }

      if (currentEnd <= modifiedValue.length - 1) {
        highlightedValue += modifiedValue.substring(currentEnd);
      }

      modifiedValue = highlightedValue;
    }

    return modifiedValue;
  }

  /* merge blocks into bigger blocks if overlap */
  collapseAndMergeBlocks(overlappingBlocks: { start: number, end: number, idx: number, type: string }[]) {
    if (overlappingBlocks.length == 0 || overlappingBlocks.length == 1) {
      return overlappingBlocks;
    }
    let chainedBlocks = [];
    chainedBlocks.push(overlappingBlocks[0]);
    chainedBlocks[0].idx = 0;

    let maxEnd = overlappingBlocks[0].end;
    let currentIdx = 0;
    for (let id = 1; id <= overlappingBlocks.length - 1; id++) {

      chainedBlocks.push(overlappingBlocks[id]);

      if (overlappingBlocks[id].start > maxEnd) {
        chainedBlocks[id].idx = currentIdx + 1;
        currentIdx += 1;
      }
      else {
        chainedBlocks[id].idx = currentIdx;
      }
      maxEnd = Math.max(overlappingBlocks[id].end, maxEnd);
    }

    let mergedBlocks = [];
    mergedBlocks.push(chainedBlocks[0]);
    currentIdx = 0;

    for (let id = 1; id <= chainedBlocks.length - 1; id++) {
      if (chainedBlocks[id].idx == currentIdx) {
        mergedBlocks[currentIdx].start = Math.min(chainedBlocks[id].start, mergedBlocks[currentIdx].start);
        mergedBlocks[currentIdx].end = Math.max(chainedBlocks[id].end, mergedBlocks[currentIdx].end);
      }
      else {
        currentIdx++;
        mergedBlocks.push(chainedBlocks[id]);
      }
    }

    return mergedBlocks;

  }

}
