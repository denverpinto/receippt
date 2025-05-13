package com.dnvr.receipptbackend.model;

import java.util.ArrayList;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class Masspart {

	@NotBlank(message = "{masspart.label.blank}")
	private String label;
	private boolean addLabelToTitle;
	@NotNull(message = "{masspart.slides.required}")
	@Valid
	private ArrayList<Slide> slides;

	public Masspart() {
		super();
	}

	public Masspart(
			@NotBlank(message = "{masspart.label.blank}") String label, 
			boolean addLabelToTitle,
			@NotNull(message = "{masspart.slides.required}") @Valid ArrayList<Slide> slides) {
		super();
		this.label = label;
		this.addLabelToTitle = addLabelToTitle;
		this.slides = slides;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public boolean getAddLabelToTitle() {
		return addLabelToTitle;
	}

	public void setAddLabelToTitle(boolean addLabelToTitle) {
		this.addLabelToTitle = addLabelToTitle;
	}

	public ArrayList<Slide> getSlides() {
		return slides;
	}

	public void setSlides(ArrayList<Slide> slides) {
		this.slides = slides;
	}

	@Override
	public String toString() {
		return "Masspart [label=" + label + ", addLabelToTitle=" + addLabelToTitle + ", slides=" + slides + "]";
	}

}