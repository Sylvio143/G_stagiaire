package com.example.back_gestion_Stage.DTOs;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BaseDTO {
    private Long id;
    private String documentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}