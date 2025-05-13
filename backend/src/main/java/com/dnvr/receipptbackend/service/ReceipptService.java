package com.dnvr.receipptbackend.service;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.geom.Rectangle2D;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.sl.usermodel.PaintStyle;
import org.apache.poi.sl.usermodel.Placeholder;
import org.apache.poi.sl.usermodel.TextParagraph.FontAlign;
import org.apache.poi.sl.usermodel.TextParagraph.TextAlign;
import org.apache.poi.xddf.usermodel.text.XDDFBodyProperties;
import org.apache.poi.xddf.usermodel.text.XDDFTextBody;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFHyperlink;
import org.apache.poi.xslf.usermodel.XSLFNotes;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextBox;
import org.apache.poi.xslf.usermodel.XSLFTextParagraph;
import org.apache.poi.xslf.usermodel.XSLFTextRun;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.dnvr.receipptbackend.exception.ReceipptException;
import com.dnvr.receipptbackend.model.Index;
import com.dnvr.receipptbackend.model.Masspart;
import com.dnvr.receipptbackend.model.Slide;
import com.dnvr.receipptbackend.model.Template;
import com.dnvr.receipptbackend.model.Verse;


@Service("pptService")
public class ReceipptService {

	@Autowired
	Environment env;

	private static final Logger logger = LoggerFactory.getLogger(ReceipptService.class);
	Rectangle2D titleAnchor = new Rectangle2D.Double(5.0d, 5.0d, 710.0d, 55.0d);
	Rectangle2D contentAnchor = new Rectangle2D.Double(5.0d, 60.0d, 710.0d, 475.0d);
	Rectangle2D contdAnchor = new Rectangle2D.Double(600.0d, 500.0d, 120.0d, 40.0d);

	Color defaultTextColor = Color.WHITE;
	Color defaultBackgroundColor = Color.BLACK;
	Color defaultHighlightedTextColor = Color.YELLOW;

	@Autowired
	LocalDbService localDbService;

	public byte[] createReceipptAttachment(Template template) throws ReceipptException {

		// 1. Check whether DB is set up and reachable
		boolean dbSetUp = localDbService.checkIfDbSetUp();
		if (!dbSetUp) {
			throw new ReceipptException(env.getProperty("local.database.setup.error"));
		} else {
			// 2. GET list of all slides via index file
			Index indexFile = localDbService.getIndexDetails();
			ArrayList<Slide> indexSlidesList = (ArrayList<Slide>) indexFile.getSlides();

			XMLSlideShow finalPpt = new XMLSlideShow();

			for (Masspart masspart : template.getMassparts()) {
				if (masspart.getSlides().size() < 1) { // create a blank slide for a masspart that has no slides
					// explicitly adding label to understand which masspart it belongs to
					masspart.setAddLabelToTitle(true);
					finalPpt = this.generateBlankSlide(finalPpt, "BLANK SLIDE", masspart, template, -1);

				} else {
					// adding slides for that masspart
					for (int slideIndex = 0; slideIndex < masspart.getSlides().size(); slideIndex++) {

						Slide currentSlide = masspart.getSlides().get(slideIndex);
						String currentSlideName = currentSlide.getName().trim().toUpperCase().trim();

						if (currentSlideName.equals("BLANK") || currentSlideName.equals("BLANK SLIDE")) {
							// explicitly adding label to understand which masspart it belongs to
							masspart.setAddLabelToTitle(true);
							finalPpt = this.generateBlankSlide(finalPpt, currentSlideName, masspart, template, slideIndex);
						} else if (indexSlidesList.stream().filter(indexEntry -> indexEntry.getName().trim().equals(currentSlideName))
								.collect(Collectors.toList()).size() > 0) { 
							// If it exists in list GET all slide verses requested in order
							try {
								ArrayList<String> desiredVerses = currentSlide.getDesiredVerses();
								ArrayList<XMLSlideShow> desiredVerseXMLs = new ArrayList<XMLSlideShow>();
								Slide currentSlideInfoInIndex = indexSlidesList.stream().filter(indexEntry -> indexEntry.getName().trim().equals(currentSlideName))
										.collect(Collectors.toList()).get(0);
								
								for(int verseIndex = 0; verseIndex < desiredVerses.size(); verseIndex++) {
									/* 
									 * cross check verse existence in actual index slide 
									 * use path from index if verse exists for slide
									 * otherwise silently ignore and move on ( bad actor / bad input )
									 */
									String desiredVerseName = desiredVerses.get(verseIndex).trim();
									
									if(currentSlideInfoInIndex.getVerses().stream().filter(indexEntry -> indexEntry.getName().equals(desiredVerseName)).
											collect(Collectors.toList()).size() > 0) {
										InputStream srcFile = localDbService.getFileContent(currentSlideInfoInIndex.getVerses().stream().filter(indexEntry -> indexEntry.getName().trim().equals(desiredVerseName)).
												collect(Collectors.toList()).get(0).getPath()); // throws ReceipptException
										XMLSlideShow slideFile = new XMLSlideShow(srcFile);
										// save XMLSlideShow files for valid verses
										desiredVerseXMLs.add(slideFile);
									}
								}

								// copy all slides from all valid verse XMLSlideShow files to the final presentation 
								for (int fileId = 0; fileId < desiredVerseXMLs.size(); fileId++) {
									XMLSlideShow verseSlidesFile = desiredVerseXMLs.get(fileId);
									for (int slideId = 0; slideId < verseSlidesFile.getSlides().size(); slideId++) {
										XSLFSlide srcSlide = verseSlidesFile.getSlides().get(slideId);
										XSLFSlide destSlide = finalPpt.createSlide().importContent(srcSlide);
										if (masspart.getAddLabelToTitle()) { // add masspart label to the title
											XSLFTextShape title = destSlide.getPlaceholder(0);

											// add index if more than 1
											if (masspart.getSlides().size() > 1) {
												title.appendText(" [" + masspart.getLabel().toUpperCase() + " "
														+ (slideIndex + 1) + "]", false);
											} else {
												title.appendText(" [" + masspart.getLabel().toUpperCase() + "]", false);
											}
										}
										// add contd.. for all slides except last one
										if(!(fileId == desiredVerseXMLs.size()-1 && slideId == verseSlidesFile.getSlides().size()-1)){
											XSLFTextBox contdBox = destSlide.createTextBox();
											contdBox.setAnchor(this.contdAnchor);
											// unset any margins of the textBody
											XDDFTextBody contdBody = contdBox.getTextBody();
											XDDFBodyProperties contdProperties = contdBody.getBodyProperties();
											contdProperties.setTopInset(0d);
											contdProperties.setBottomInset(0d);
											contdProperties.setLeftInset(0d);
											contdProperties.setRightInset(0d);
											// unset any existing text
											contdBox.clearText();
											// remove any existing TextParagraphs
											List<XSLFTextParagraph> xslfContdParagraphs = contdBox.getTextParagraphs();
											xslfContdParagraphs.forEach((textParagraph) -> {
												contdBox.removeTextParagraph(textParagraph);
											});
											
											// add a TextParagraph
											XSLFTextParagraph xslfContdParagraph = contdBox.addNewTextParagraph();
											xslfContdParagraph.setBullet(false);
											xslfContdParagraph.setTextAlign(TextAlign.RIGHT);
											xslfContdParagraph.setFontAlign(FontAlign.CENTER);
											xslfContdParagraph.setIndent(0.0d);
											xslfContdParagraph.setIndentLevel(0);
											XSLFTextRun contd = xslfContdParagraph.addNewTextRun();
											contd.setText("contd..");
											contd.setFontSize(36.0d);
											contd.setFontColor(new Color(Integer.parseInt(template.getHighlightedTextColor().substring(1, 3), 16),
													Integer.parseInt(template.getHighlightedTextColor().substring(3, 5), 16),
													Integer.parseInt(template.getHighlightedTextColor().substring(5), 16)));
											contd.setFontFamily("Calibri");
											contd.setBold(true);
											contd.setItalic(true);
											contd.setUnderlined(false);
										}
									}
								}								
								
							} catch (Exception ex) {
								// If retrieval resulted in an error, then create BLANK slide for that slide
								System.out.println(ex.getMessage());
								ex.printStackTrace();
								logger.error(env.getProperty("local.database.file.read.error"));
								// explicitly adding label to understand which masspart it belongs to
								masspart.setAddLabelToTitle(true);
								finalPpt = this.generateBlankSlide(finalPpt, currentSlideName, masspart, template, slideIndex);
							}

						} else {
							// If it doesn't exist create BLANK slide for that slide
							// explicitly adding label to understand which masspart it belongs to
							masspart.setAddLabelToTitle(true);
							finalPpt = this.generateBlankSlide(finalPpt, currentSlideName, masspart, template, slideIndex);
						}
					}
				}
			}
			// 4. change color and background color of all slides if required
			for (XSLFSlide slide : finalPpt.getSlides()) {
				// set background color of slide;
				if (slide.getXmlObject().getCSld().getBg() == null)
					slide.getXmlObject().getCSld().addNewBg();
				slide.getBackground()
						.setFillColor(new Color(Integer.parseInt(template.getBackgroundColor().substring(1, 3), 16),
								Integer.parseInt(template.getBackgroundColor().substring(3, 5), 16),
								Integer.parseInt(template.getBackgroundColor().substring(5), 16)));

				for (XSLFShape sh : slide.getShapes()) {
					if (sh instanceof XSLFTextShape) {
						XSLFTextShape shape = (XSLFTextShape) sh;
						// work with a shape that can hold text
						for (XSLFTextParagraph textPara : shape.getTextParagraphs()) {
							for (XSLFTextRun textRun : textPara.getTextRuns()) {

								if (((PaintStyle.SolidPaint) textRun.getFontColor()).getSolidColor().getColor()
										.getRGB() == this.defaultTextColor.getRGB()) { // text color change
									textRun.setFontColor(
											new Color(Integer.parseInt(template.getTextColor().substring(1, 3), 16),
													Integer.parseInt(template.getTextColor().substring(3, 5), 16),
													Integer.parseInt(template.getTextColor().substring(5), 16)));
								} else if (((PaintStyle.SolidPaint) textRun.getFontColor()).getSolidColor().getColor()
										.getRGB() == this.defaultHighlightedTextColor.getRGB()) { // highlighted
																									// textcolor change
									textRun.setFontColor(new Color(
											Integer.parseInt(template.getHighlightedTextColor().substring(1, 3), 16),
											Integer.parseInt(template.getHighlightedTextColor().substring(3, 5), 16),
											Integer.parseInt(template.getHighlightedTextColor().substring(5), 16)));
								}
							}
						}
					}
				}
				// 5. Add receippt.com shoutout in slide notes
				XSLFNotes note = finalPpt.getNotesSlide(slide);
				for (XSLFTextShape shape : note.getPlaceholders()) {
					if (shape.getTextType() == Placeholder.BODY) {
						XSLFTextRun notesText = shape.setText(env.getProperty("receippt.notes.shoutout"));
						//XSLFHyperlink link = notesText.createHyperlink();
						//link.setAddress(env.getProperty("receippt.website.url"));
						break;
					}
				}
			}
			// 6. Return file
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			try {
				finalPpt.write(bos);
				finalPpt.close();
			} catch (IOException e) {
				logger.error(e.toString());
				throw new ReceipptException(env.getProperty("receippt.creation.error"));
			}
			byte[] bytes = bos.toByteArray();
			return bytes;

			/*
			 * // 6. Save file FileOutputStream out; try { out = new
			 * FileOutputStream(template.getSaveAsFileName() + ".pptx");
			 * finalPpt.write(out); } catch (FileNotFoundException e1) {
			 * logger.error(e1.toString()); // TODO handle cases when final ppt cannot be
			 * written FILE NOT FOUND throw new
			 * ReceipptException("File couldn't be created"); } catch (IOException e) {
			 * logger.error(e.toString()); // TODO handle cases when final ppt cannot be
			 * written IO Exception throw new ReceipptException("File couldn't be created");
			 * }
			 */

		}

	}

	/*
	 * INPUT - x OUTPUT - {slides: [] }
	 */
	public Index getReceipptIndexFromLocalFS() throws ReceipptException {
		Index indexFile = null;
		// 1. Check whether DB is set up
		boolean dbSetUp = localDbService.checkIfDbSetUp();
		if (!dbSetUp) {
			throw new ReceipptException(env.getProperty("local.database.setup.error"));
		} else {
			// 2. GET index file
			indexFile = localDbService.getIndexDetails();
		}
		return indexFile;
	}

	public XMLSlideShow generateBlankSlide(XMLSlideShow ppt, String slide, Masspart masspart, Template template,
			int slideIndex) {
		XSLFSlide blankSlide = ppt.createSlide();
		if (blankSlide.getXmlObject().getCSld().getBg() == null)
			blankSlide.getXmlObject().getCSld().addNewBg();

		// TITLE;
		XSLFTextBox titleBox = blankSlide.createTextBox();
		titleBox.setAnchor(this.titleAnchor);
		// unset any existing text
		titleBox.clearText();
		// remove any existing TextParagraphs
		List<XSLFTextParagraph> xslfTitleParagraphs = titleBox.getTextParagraphs();
		xslfTitleParagraphs.forEach((textParagraph) -> {
			titleBox.removeTextParagraph(textParagraph);
		});

		// add a TextParagraph
		XSLFTextParagraph xslfTitleParagraph = titleBox.addNewTextParagraph();
		xslfTitleParagraph.setBullet(false);
		xslfTitleParagraph.setTextAlign(TextAlign.LEFT);
		xslfTitleParagraph.setFontAlign(FontAlign.TOP);
		xslfTitleParagraph.setIndent(0.0d);
		xslfTitleParagraph.setIndentLevel(0);

		XSLFTextRun title = xslfTitleParagraph.addNewTextRun();
		title.setFontSize(32.0d);
		if (masspart.getAddLabelToTitle()) {
			// add index if more than 1
			if (masspart.getSlides().size() > 1 && slideIndex != -1) {
				title.setText(slide + " [" + masspart.getLabel().toUpperCase() + " " + (slideIndex + 1) + "]");
			} else {
				title.setText(slide + " [" + masspart.getLabel().toUpperCase() + "]");
			}
		} else {
			title.setText(slide);
		}
		title.setFontColor(new Color(Integer.parseInt(template.getTextColor().substring(1, 3), 16),
				Integer.parseInt(template.getTextColor().substring(3, 5), 16),
				Integer.parseInt(template.getTextColor().substring(5), 16)));
		title.setFontFamily("Calibri");
		title.setBold(true);
		title.setItalic(false);
		title.setUnderlined(true);

		// CONTENT;
		XSLFTextBox contentBox = blankSlide.createTextBox();
		contentBox.setAnchor(this.contentAnchor);

		// unset any existing text
		contentBox.clearText();
		// remove any existing TextParagraphs
		List<XSLFTextParagraph> xslfTextParagraphs = contentBox.getTextParagraphs();
		xslfTextParagraphs.forEach((textParagraph) -> {
			contentBox.removeTextParagraph(textParagraph);
		});
		// add a TextParagraph
		XSLFTextParagraph xslfContentParagraph = contentBox.addNewTextParagraph();
		xslfContentParagraph.setBullet(false);
		xslfContentParagraph.setTextAlign(TextAlign.LEFT);
		xslfContentParagraph.setFontAlign(FontAlign.TOP);
		xslfContentParagraph.setIndent(0.0d);
		xslfContentParagraph.setIndentLevel(0);

		XSLFTextRun content = xslfContentParagraph.addNewTextRun();
		content.setFontSize(36.0d);
		content.setText("...");
		content.setFontColor(new Color(Integer.parseInt(template.getTextColor().substring(1, 3), 16),
				Integer.parseInt(template.getTextColor().substring(3, 5), 16),
				Integer.parseInt(template.getTextColor().substring(5), 16)));
		content.setFontFamily("Calibri");
		content.setBold(true);
		content.setItalic(false);
		content.setUnderlined(false);

		// CONTD..
		XSLFTextBox contdBox = blankSlide.createTextBox();
		contdBox.setAnchor(this.contdAnchor);
		// unset any margins of the textBody
		XDDFTextBody contdBody = contdBox.getTextBody();
		XDDFBodyProperties contdProperties = contdBody.getBodyProperties();
		contdProperties.setTopInset(0d);
		contdProperties.setBottomInset(0d);
		contdProperties.setLeftInset(0d);
		contdProperties.setRightInset(0d);
		// unset any existing text
		contdBox.clearText();
		// remove any existing TextParagraphs
		List<XSLFTextParagraph> xslfContdParagraphs = contdBox.getTextParagraphs();
		xslfContdParagraphs.forEach((textParagraph) -> {
			contdBox.removeTextParagraph(textParagraph);
		});

		// add a TextParagraph
		XSLFTextParagraph xslfContdParagraph = contdBox.addNewTextParagraph();
		xslfContdParagraph.setBullet(false);
		xslfContdParagraph.setTextAlign(TextAlign.RIGHT);
		xslfContdParagraph.setFontAlign(FontAlign.CENTER);
		xslfContdParagraph.setIndent(0.0d);
		xslfContdParagraph.setIndentLevel(0);
		XSLFTextRun contd = xslfContdParagraph.addNewTextRun();
		contd.setText("contd..");
		contd.setFontSize(36.0d);
		contd.setFontColor(new Color(Integer.parseInt(template.getHighlightedTextColor().substring(1, 3), 16),
				Integer.parseInt(template.getHighlightedTextColor().substring(3, 5), 16),
				Integer.parseInt(template.getHighlightedTextColor().substring(5), 16)));
		contd.setFontFamily("Calibri");
		contd.setBold(true);
		contd.setItalic(true);
		contd.setUnderlined(false);

		return ppt;
	}
}