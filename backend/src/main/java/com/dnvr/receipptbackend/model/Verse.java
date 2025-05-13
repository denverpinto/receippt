package com.dnvr.receipptbackend.model;

import java.util.ArrayList;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Verse {
	@NotBlank(message ="{verse.name.blank}")
	private String name;
	@NotNull(message ="{verse.tags.null}")
	private ArrayList<String> tags;
	@NotBlank(message ="{verse.path.blank}")
	private String path;
	@NotBlank(message ="{verse.html.blank}")
	private String html;
	@NotBlank(message ="{verse.text.blank}")
	private String text;

	public Verse() {
		super();
	}
	
	public Verse(
			@NotBlank(message ="{verse.name.blank}") String name,
			@NotNull(message ="{verse.tags.null}") ArrayList<String> tags,
			@NotBlank(message ="{verse.path.blank}") String path, 
			@NotBlank(message ="{verse.html.blank}") String html, 
			@NotBlank(message ="{verse.text.blank}") String text) {
		super();
		this.name = name;
		this.tags = tags;
		this.path = path;
		this.html = html;
		this.text = text;
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
	public String getHtml() {
		return html;
	}
	public void setHtml(String html) {
		this.html = html;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}

	@Override
	public String toString() {
		return "Verse [name=" + name + ", tags=" + tags + ", path=" + path + ", html=" + html + ", text=" + text + "]";
	}
	
}
