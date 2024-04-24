package com.dnvr.receipptbackend.model;

import java.util.ArrayList;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class Template {
	
	private String id;
	private String tag;
	@NotNull(message ="{template.saveAsFileName.null}")
	@NotBlank(message ="{template.saveAsFileName.blank}")
	private String saveAsFileName;
	@NotNull(message ="{template.massparts.null}")
	@NotEmpty(message ="{template.massparts.empty}")
	@Valid
	private ArrayList<Masspart> massparts;
	@NotNull(message ="{template.textColor.null}")
	@Pattern(regexp = "^#[0-9a-fA-F]{6}$", message ="{template.textColor.pattern}") //#RRGGBB
	private String textColor;
	@NotNull(message ="{template.backgroundColor.null}")
	@Pattern(regexp = "^#[0-9a-fA-F]{6}$", message ="{template.backgroundColor.pattern}") //#RRGGBB
	private String backgroundColor;
	@NotNull(message ="{template.highlightedTextColor.null}")
	@Pattern(regexp = "^#[0-9a-fA-F]{6}$", message ="{template.highlightedTextColor.pattern}") //#RRGGBB
	private String highlightedTextColor;
	
	public Template() {
		super();
	}
	
	
	public Template(String id, String tag,
			@NotNull(message = "{template.saveAsFileName.null}") @NotBlank(message = "{template.saveAsFileName.blank}") String saveAsFileName,
			@NotNull(message = "{template.massparts.null}") @NotEmpty(message = "{template.massparts.empty}") @Valid ArrayList<Masspart> massparts,
			@NotNull(message = "{template.textColor.null}") @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "{template.textColor.pattern}") String textColor,
			@NotNull(message = "{template.backgroundColor.null}") @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "{template.backgroundColor.pattern}") String backgroundColor,
			@NotNull(message = "{template.highlightedTextColor.null}") @Pattern(regexp = "^#[0-9a-fA-F]{6}$", message = "{template.highlightedTextColor.pattern}") String highlightedTextColor) {
		super();
		this.id = id;
		this.tag = tag;
		this.saveAsFileName = saveAsFileName;
		this.massparts = massparts;
		this.textColor = textColor;
		this.backgroundColor = backgroundColor;
		this.highlightedTextColor = highlightedTextColor;
	}


	public String getTag() {
		return tag;
	}


	public void setTag(String tag) {
		this.tag = tag;
	}


	public String getHighlightedTextColor() {
		return highlightedTextColor;
	}

	public void setHighlightedTextColor(String highlightedTextColor) {
		this.highlightedTextColor = highlightedTextColor;
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSaveAsFileName() {
		return saveAsFileName;
	}
	public void setSaveAsFileName(String saveAsFileName) {
		this.saveAsFileName = saveAsFileName;
	}
	public ArrayList<Masspart> getMassparts() {
		return massparts;
	}
	public void setMassparts(ArrayList<Masspart> massparts) {
		this.massparts = massparts;
	}
	public String getTextColor() {
		return textColor;
	}
	public void setTextColor(String textColor) {
		this.textColor = textColor;
	}
	public String getBackgroundColor() {
		return backgroundColor;
	}
	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}

	@Override
	public String toString() {
		return "Template [id=" + id + ", saveAsFileName=" + saveAsFileName + ", massparts=" + massparts + ", textColor="
				+ textColor + ", backgroundColor=" + backgroundColor + ", highlightedTextColor=" + highlightedTextColor
				+ "]";
	}

}
