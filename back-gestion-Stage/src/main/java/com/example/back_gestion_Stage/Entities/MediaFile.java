package com.example.back_gestion_Stage.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "media_files")
@Data
@EqualsAndHashCode(callSuper = true)
public class MediaFile extends BaseEntity{
    @Column(nullable = false)
    private String name;
    
    private String alternativeText;
    
    private String caption;
    
    private Integer width;
    
    private Integer height;
    
    private String ext;
    
    private String mime;
    
    private Double size; // en KB
    
    @Column(nullable = false)
    private String url;
    
    private String provider = "local";
    
    // Format thumbnail pour affichage rapide
    private String thumbnailUrl;
    
    // Format medium pour les pages de détails
    private String mediumUrl;
}
