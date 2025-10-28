package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.MediaFileDTO;
import com.example.back_gestion_Stage.Services.MediaFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaFileController {

    @Autowired
    private MediaFileService mediaFileService;

    @GetMapping
    public ResponseEntity<List<MediaFileDTO>> getAllMediaFiles() {
        List<MediaFileDTO> mediaFiles = mediaFileService.findAll();
        return ResponseEntity.ok(mediaFiles);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<MediaFileDTO> getMediaFile(@PathVariable String documentId) {
        return mediaFileService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<MediaFileDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "alternativeText", required = false) String alternativeText,
            @RequestParam(value = "caption", required = false) String caption) {
        
        try {
            MediaFileDTO mediaFileDTO = mediaFileService.uploadFile(file, alternativeText, caption);
            return ResponseEntity.ok(mediaFileDTO);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteMediaFile(@PathVariable String documentId) {
        if (!mediaFileService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        mediaFileService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/images")
    public ResponseEntity<List<MediaFileDTO>> getAllImages() {
        List<MediaFileDTO> images = mediaFileService.findAllImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/pdfs")
    public ResponseEntity<List<MediaFileDTO>> getAllPdfs() {
        List<MediaFileDTO> pdfs = mediaFileService.findAllPdfs();
        return ResponseEntity.ok(pdfs);
    }

    @GetMapping("/mime/{mime}")
    public ResponseEntity<List<MediaFileDTO>> getMediaByMimeType(@PathVariable String mime) {
        List<MediaFileDTO> mediaFiles = mediaFileService.findByMime(mime);
        return ResponseEntity.ok(mediaFiles);
    }

    @GetMapping("/stats")
    public ResponseEntity<MediaFileService.MediaStats> getMediaStats() {
        MediaFileService.MediaStats stats = mediaFileService.getMediaStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<MediaFileDTO> getMediaByName(@PathVariable String name) {
        return mediaFileService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}