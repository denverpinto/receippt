package com.dnvr.receipptbackend.service;

import java.io.File;
import java.io.FileReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.dnvr.receipptbackend.exception.ReceipptException;
import com.dnvr.receipptbackend.model.Index;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service("localDbService")
public class LocalDbService {
	@Autowired Environment env;

	public boolean checkIfDbSetUp() throws ReceipptException {
		try {
			// Creating a File object for directory
			//File dbDirectoryPath = new File(env.getProperty("local.database.path"));
			File dbDirectoryPath = Paths.get(env.getProperty("local.database.path")).toFile();
			// List of all files and directories
			List<String> directoryContents = Arrays.asList(dbDirectoryPath.list());
			return directoryContents.contains("index.json");
		} catch (Exception e) {
			throw new ReceipptException(env.getProperty("local.database.verification.error"));
		}
	}

	public Index getIndexDetails() throws ReceipptException {
		// return index.json containing predefs and tags metadata
		Index indexFile = null;
		System.out.println(Paths.get(env.getProperty("local.database.path"),"index.json").toString());
		if (this.checkIfDbSetUp()) {
			try {
				ObjectMapper objectMapper = new ObjectMapper();
				//indexFile = objectMapper.readValue(new File(env.getProperty("local.database.path")+File.separator+"index.json"), Index.class);
				indexFile = objectMapper.readValue(Paths.get(env.getProperty("local.database.path"),"index.json").toFile(), Index.class);
			} catch (Exception e) {
				System.out.println(e.getMessage());
				throw new ReceipptException(env.getProperty("local.database.index.read.error"));
			}
		} else {
			throw new ReceipptException(env.getProperty("local.database.setup.error"));
		}
		return indexFile;
	}

	public InputStream getFileContent(String filePath) throws ReceipptException {
		if (this.checkIfDbSetUp()) {
			try {
				//FileInputStream fileIn = new FileInputStream(env.getProperty("local.database.path") + File.separator + filePath);
				FileInputStream fileIn = new FileInputStream(Paths.get(env.getProperty("local.database.path"),filePath).toFile());
				return fileIn;
			} catch (Exception e) {
				throw new ReceipptException(env.getProperty("local.database.file.read.error")+":filePath");
			}
		} else {
			throw new ReceipptException(env.getProperty("local.database.setup.error"));
		}
	}

}
