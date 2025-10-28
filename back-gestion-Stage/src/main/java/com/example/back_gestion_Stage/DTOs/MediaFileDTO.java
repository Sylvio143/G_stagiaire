package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MediaFileDTO extends BaseDTO {
    private String name;
    private String alternativeText;
    private String caption;
    private Integer width;
    private Integer height;
    private String ext;
    private String mime;
    private Double size;
    private String url;
    private String provider;
    private String thumbnailUrl;
    private String mediumUrl;
}