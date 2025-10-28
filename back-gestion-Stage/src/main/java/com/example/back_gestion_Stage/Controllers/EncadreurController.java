package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.EncadreurDTO;
import com.example.back_gestion_Stage.Services.EncadreurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encadreurs")
@CrossOrigin(origins = "*")
public class EncadreurController {

    @Autowired
    private EncadreurService encadreurService;

    @GetMapping
    public ResponseEntity<List<EncadreurDTO>> getAllEncadreurs() {
        List<EncadreurDTO> encadreurs = encadreurService.findAll();
        return ResponseEntity.ok(encadreurs);
    }

    @GetMapping("/with-superieur")
    public ResponseEntity<List<EncadreurDTO>> getAllEncadreursWithSuperieur() {
        List<EncadreurDTO> encadreurs = encadreurService.findAllWithSuperieur();
        return ResponseEntity.ok(encadreurs);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<EncadreurDTO> getEncadreurByDocumentId(@PathVariable String documentId) {
        return encadreurService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<EncadreurDTO> getEncadreurByEmail(@PathVariable String email) {
        return encadreurService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EncadreurDTO> createEncadreur(@RequestBody EncadreurDTO encadreurDTO) {
        // Vérifications
        if (encadreurService.existsByEmail(encadreurDTO.getEmail())) {
            return ResponseEntity.badRequest().body(null);
        }
        if (encadreurService.existsByCin(encadreurDTO.getCin())) {
            return ResponseEntity.badRequest().body(null);
        }

        EncadreurDTO savedEncadreur = encadreurService.save(encadreurDTO);
        return ResponseEntity.ok(savedEncadreur);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<EncadreurDTO> updateEncadreur(@PathVariable String documentId, @RequestBody EncadreurDTO encadreurDTO) {
        if (!encadreurService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        encadreurDTO.setDocumentId(documentId);
        EncadreurDTO updatedEncadreur = encadreurService.save(encadreurDTO);
        return ResponseEntity.ok(updatedEncadreur);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteEncadreur(@PathVariable String documentId) {
        if (!encadreurService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        encadreurService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/superieur/{superieurDocumentId}")
    public ResponseEntity<List<EncadreurDTO>> getEncadreursBySuperieur(@PathVariable String superieurDocumentId) {
        List<EncadreurDTO> encadreurs = encadreurService.findBySuperieurHierarchique(superieurDocumentId);
        return ResponseEntity.ok(encadreurs);
    }

    @GetMapping("/departement/{departement}")
    public ResponseEntity<List<EncadreurDTO>> getEncadreursByDepartement(@PathVariable String departement) {
        List<EncadreurDTO> encadreurs = encadreurService.findByDepartement(departement);
        return ResponseEntity.ok(encadreurs);
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = encadreurService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-cin/{cin}")
    public ResponseEntity<Boolean> checkCinExists(@PathVariable String cin) {
        boolean exists = encadreurService.existsByCin(cin);
        return ResponseEntity.ok(exists);
    }
}