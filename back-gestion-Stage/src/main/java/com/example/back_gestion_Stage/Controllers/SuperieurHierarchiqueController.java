package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.SuperieurHierarchiqueDTO;
import com.example.back_gestion_Stage.Entities.StatutEntite;
import com.example.back_gestion_Stage.Services.SuperieurHierarchiqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superieurs-hierarchiques")
@CrossOrigin(origins = "*")
public class SuperieurHierarchiqueController {

    @Autowired
    private SuperieurHierarchiqueService superieurHierarchiqueService;

    @GetMapping
    public ResponseEntity<List<SuperieurHierarchiqueDTO>> getAllSuperieurs() {
        List<SuperieurHierarchiqueDTO> superieurs = superieurHierarchiqueService.findAllActifs();
        return ResponseEntity.ok(superieurs);
    }

    @GetMapping("/tous")
    public ResponseEntity<List<SuperieurHierarchiqueDTO>> getAllSuperieursWithInactifs() {
        List<SuperieurHierarchiqueDTO> superieurs = superieurHierarchiqueService.findAll();
        return ResponseEntity.ok(superieurs);
    }

    @GetMapping("/with-photo")
    public ResponseEntity<List<SuperieurHierarchiqueDTO>> getAllSuperieursWithPhoto() {
        List<SuperieurHierarchiqueDTO> superieurs = superieurHierarchiqueService.findAllWithPhoto();
        return ResponseEntity.ok(superieurs);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<SuperieurHierarchiqueDTO> getSuperieurByDocumentId(@PathVariable String documentId) {
        return superieurHierarchiqueService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<SuperieurHierarchiqueDTO> getSuperieurByEmail(@PathVariable String email) {
        return superieurHierarchiqueService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SuperieurHierarchiqueDTO> createSuperieur(@RequestBody SuperieurHierarchiqueDTO superieurDTO) {
        // Vérifications
        if (superieurHierarchiqueService.existsByEmail(superieurDTO.getEmail())) {
            return ResponseEntity.badRequest().body(null);
        }
        if (superieurHierarchiqueService.existsByCin(superieurDTO.getCin())) {
            return ResponseEntity.badRequest().body(null);
        }

        // S'assurer que le statut est ACTIF par défaut
        superieurDTO.setStatut(StatutEntite.ACTIF);
        SuperieurHierarchiqueDTO savedSuperieur = superieurHierarchiqueService.save(superieurDTO);
        return ResponseEntity.ok(savedSuperieur);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<SuperieurHierarchiqueDTO> updateSuperieur(@PathVariable String documentId, @RequestBody SuperieurHierarchiqueDTO superieurDTO) {
        if (!superieurHierarchiqueService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
    
        // Vérifications de doublons en excluant le supérieur actuel
        if (superieurHierarchiqueService.existsByEmailAndNotId(superieurDTO.getEmail(), documentId)) {
            return ResponseEntity.badRequest().body(null); // Ou retourner une erreur spécifique
        }
        
        if (superieurHierarchiqueService.existsByCinAndNotId(superieurDTO.getCin(), documentId)) {
            return ResponseEntity.badRequest().body(null); // Ou retourner une erreur spécifique
        }
    
        superieurDTO.setDocumentId(documentId);
        SuperieurHierarchiqueDTO updatedSuperieur = superieurHierarchiqueService.save(superieurDTO);
        return ResponseEntity.ok(updatedSuperieur);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteSuperieur(@PathVariable String documentId) {
        if (!superieurHierarchiqueService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        superieurHierarchiqueService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    // NOUVEAUX ENDPOINTS POUR LA GESTION DU STATUT
    @PutMapping("/{documentId}/desactiver")
    public ResponseEntity<SuperieurHierarchiqueDTO> desactiverSuperieur(@PathVariable String documentId) {
        SuperieurHierarchiqueDTO superieur = superieurHierarchiqueService.desactiver(documentId);
        return superieur != null ? ResponseEntity.ok(superieur) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{documentId}/activer")
    public ResponseEntity<SuperieurHierarchiqueDTO> activerSuperieur(@PathVariable String documentId) {
        SuperieurHierarchiqueDTO superieur = superieurHierarchiqueService.activer(documentId);
        return superieur != null ? ResponseEntity.ok(superieur) : ResponseEntity.notFound().build();
    }

    @GetMapping("/inactifs")
    public ResponseEntity<List<SuperieurHierarchiqueDTO>> getSuperieursInactifs() {
        List<SuperieurHierarchiqueDTO> superieurs = superieurHierarchiqueService.findByStatut(StatutEntite.INACTIF);
        return ResponseEntity.ok(superieurs);
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<SuperieurHierarchiqueDTO>> getSuperieursByStatut(@PathVariable StatutEntite statut) {
        List<SuperieurHierarchiqueDTO> superieurs = superieurHierarchiqueService.findByStatut(statut);
        return ResponseEntity.ok(superieurs);
    }

    // ENDPOINTS EXISTANTS
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = superieurHierarchiqueService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-cin/{cin}")
    public ResponseEntity<Boolean> checkCinExists(@PathVariable String cin) {
        boolean exists = superieurHierarchiqueService.existsByCin(cin);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/departement/{departement}")
    public ResponseEntity<List<SuperieurHierarchiqueDTO>> getSuperieursByDepartement(@PathVariable String departement) {
        List<SuperieurHierarchiqueDTO> superieurs = superieurHierarchiqueService.findByDepartement(departement);
        return ResponseEntity.ok(superieurs);
    }

    @GetMapping("/stats/count")
    public ResponseEntity<Long> getTotalCount() {
        long count = superieurHierarchiqueService.countTotal();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/departement/{departement}/count")
    public ResponseEntity<Long> getCountByDepartement(@PathVariable String departement) {
        long count = superieurHierarchiqueService.countByDepartement(departement);
        return ResponseEntity.ok(count);
    }
}