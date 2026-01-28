package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {
    @Value("${cloudinary.cloud_name}")
    String cloud_name;
    @Value("${cloudinary.api_key}")
    String api_key;
    @Value("${cloudinary.api_secret}")
    String api_secret;

    @Bean
    public Cloudinary getCloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloud_name,
                "api_key", api_key,
                "api_secret", api_secret,
                "secure", true));
    }
}
