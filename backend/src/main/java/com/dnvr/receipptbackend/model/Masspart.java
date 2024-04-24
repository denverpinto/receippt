package com.dnvr.receipptbackend.model;

import java.util.ArrayList;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Masspart {

	@NotBlank(message ="{masspart.label.blank}")
	@NotNull(message ="{masspart.label.null}")
	private String label;
	@NotNull(message ="{masspart.addLabelToTitle.null}")
	private boolean addLabelToTitle;
	@NotNull(message ="{masspart.slides.null}")
	 private ArrayList<String> slides;

	public Masspart() {
		super();
	}

	public Masspart(String label, boolean addLabelToTitle, ArrayList<String> slides) {
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

	public ArrayList<String> getSlides() {
		return slides;
	}

	public void setSlides(ArrayList<String> slides) {
		this.slides = slides;
	}
	
	@Override
	public String toString() {
		return "Masspart [label=" + label + ", addLabelToTitle=" + addLabelToTitle + ", slides=" + slides + "]";
	}

}