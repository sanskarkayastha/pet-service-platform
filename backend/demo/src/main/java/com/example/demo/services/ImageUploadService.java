package com.example.demo.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class ImageUploadService {
    @Autowired
    private Cloudinary cloudinary;

    public String imageUpload(MultipartFile imageFile) throws IOException {
        Map result = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
        return result.get("secure_url").toString();
    }
}
