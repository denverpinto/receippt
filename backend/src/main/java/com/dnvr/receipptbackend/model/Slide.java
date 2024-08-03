package com.dnvr.receipptbackend.model;

import java.util.List;

public class Slide {
	private String name;
	private List<String> tags;
	private String path;
	private String html;
	private String text;
	
	public String getText() {
		return text;
	}



	public void setText(String text) {
		this.text = text;
	}



	public Slide() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

	public Slide(String name, List<String> tags, String path, String html, String text) {
		super();
		this.name = name;
		this.tags = tags;
		this.path = path;
		this.html = html;
		this.text = text;
		}

	public String getHtml() {
		return html;
	}



	public void setHtml(String html) {
		this.html = html;
	}



	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}


	@Override
	public String toString() {
		return "Slide [name=" + name + ", tags=" + tags + ", path=" + path + "]";
	}
	
}
