package com.dnvr.receipptbackend.model;

import java.util.List;

public class Index {
	
	private List<Slide> slides;

	private List<Template> templates;
	
	public Index() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

	public Index(List<Slide> slides) {
		super();
		this.slides = slides;
	}

	public List<Slide> getSlides() {
		return slides;
	}

	public void setSlides(List<Slide> slides) {
		this.slides = slides;
	}



	public List<Template> getTemplates() {
		return templates;
	}



	public void setTemplates(List<Template> templates) {
		this.templates = templates;
	}



	@Override
	public String toString() {
		return "Index [slides=" + slides + ", templates=" + templates + "]";
	}



}
