package com.dnvr.receipptbackend.api;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dnvr.receipptbackend.exception.ReceipptException;
import com.dnvr.receipptbackend.model.Index;
import com.dnvr.receipptbackend.model.Template;
import com.dnvr.receipptbackend.service.ReceipptService;

@RestController
@CrossOrigin
public class ReceipptApi {
	@Autowired ReceipptService pptService;
	
	
	public static final String INDEX_GET_ENDPOINT = "${api.get.index}";
	public static final String DOWNLOAD_POST_ENDPOINT = "${api.post.download}";
	
	/* provide index entry */
	@GetMapping(INDEX_GET_ENDPOINT)
	public ResponseEntity<Index> retrieveIndex() throws ReceipptException{
		Index index = pptService.getReceipptIndexFromLocalFS();
		return new ResponseEntity<>(index,HttpStatus.OK);
	}
	
	@PostMapping(DOWNLOAD_POST_ENDPOINT)
	public ResponseEntity<byte[]> downloadReceippt(@Valid @RequestBody Template template) throws ReceipptException{
		byte[] fileToDownload = pptService.createReceipptAttachment(template);
		
		HttpHeaders respHeaders = new HttpHeaders();
		respHeaders.setContentLength(fileToDownload.length);
		respHeaders.setContentType(new MediaType("application", "octet-stream"));
		
		//respHeaders.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + template.getSaveAsFileName());
		ContentDisposition contentdisposition = ContentDisposition.builder("attachment")
        .filename(template.getSaveAsFileName())
        .build();
		respHeaders.setContentDisposition(contentdisposition);
		
		respHeaders.set("Access-Control-Expose-Headers","Content-Disposition");
		
		return new ResponseEntity<>(fileToDownload,respHeaders,HttpStatus.OK);
		
	}
	
	
}
