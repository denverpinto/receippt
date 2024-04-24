package com.dnvr.receipptbackend.model;

import java.util.List;

public class Slide {
	private String name;
	private List<String> tags;
	private String path;
	private float lastModified;
	private boolean consistent;
	private String html;
	
	public Slide() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

	public Slide(String name, List<String> tags, String path, float lastModified, boolean consistent, String html) {
		super();
		this.name = name;
		this.tags = tags;
		this.path = path;
		this.lastModified = lastModified;
		this.consistent = consistent;
		this.html = html;
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

	public float getLastModified() {
		return lastModified;
	}

	public void setLastModified(float lastModified) {
		this.lastModified = lastModified;
	}


	public boolean isConsistent() {
		return consistent;
	}



	public void setConsistent(boolean consistent) {
		this.consistent = consistent;
	}



	@Override
	public String toString() {
		return "Slide [name=" + name + ", tags=" + tags + ", path=" + path + ", lastModified=" + lastModified
				+ ", consistent=" + consistent + "]";
	}
	
}
