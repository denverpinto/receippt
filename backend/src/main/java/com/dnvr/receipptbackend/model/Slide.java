package com.dnvr.receipptbackend.model;

import java.util.ArrayList;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

public class Slide {
	@NotBlank(message ="{slide.name.blank}")
	private String name;
	@NotNull(message ="{slide.tags.null}")
	private ArrayList<String> tags;
	@NotBlank(message ="{slide.path.blank}")
	private String path;
	@NotEmpty(message ="{slide.verses.blank}")
	@Valid
	private ArrayList<Verse> verses;
	@NotEmpty(message ="{slide.desiredVerses.blank}")
	private ArrayList<String> desiredVerses;


	public Slide(
		@NotBlank(message ="{slide.name.blank}") String name, 
		@NotNull(message ="{slide.tags.null}") ArrayList<String> tags, 
		@NotBlank(message ="{slide.path.blank}") String path, 
		@NotEmpty(message ="{slide.verse.blank}") @Valid ArrayList<Verse> verses,
		@NotEmpty(message ="{slide.desiredVerses.blank}") ArrayList<String> desiredVerses) {
		super();
		this.name = name;
		this.tags = tags;
		this.path = path;
		this.verses = verses;
		this.desiredVerses = desiredVerses;
	}

	public Slide() {
		super();
		// TODO Auto-generated constructor stub
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ArrayList<String> getTags() {
		return tags;
	}

	public void setTags(ArrayList<String> tags) {
		this.tags = tags;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public ArrayList<Verse> getVerses() {
		return verses;
	}

	public void setVerses(ArrayList<Verse> verses) {
		this.verses = verses;
	}

	public ArrayList<String> getDesiredVerses() {
		return desiredVerses;
	}

	public void setDesiredVerses(ArrayList<String> desiredVerses) {
		this.desiredVerses = desiredVerses;
	}

	@Override
	public String toString() {
		return "Slide [name=" + name + ", tags=" + tags + ", path=" + path + ", verses=" + verses + ", desiredVerses="
				+ desiredVerses + "]";
	}

	
}
