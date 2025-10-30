package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.CompteUtilisateurDTO;
import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import com.example.back_gestion_Stage.Entities.StatutEntite;
import com.example.back_gestion_Stage.Services.CompteUtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comptes-utilisateurs")
@CrossOrigin(origins = "*")
public class CompteUtilisateurController {

    @Autowired
    private CompteUtilisateurService compteUtilisateurService;

    @GetMapping
    public ResponseEntity<List<CompteUtilisateurDTO>> getAllComptes() {
        try {
            List<CompteUtilisateurDTO> comptes = compteUtilisateurService.findAllActifs();
            return ResponseEntity.ok(comptes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/tous")
    public ResponseEntity<List<CompteUtilisateurDTO>> getAllComptesWithInactifs() {
        try {
            List<CompteUtilisateurDTO> comptes = compteUtilisateurService.findAll();
            return ResponseEntity.ok(comptes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<CompteUtilisateurDTO> getCompteByDocumentId(@PathVariable String documentId) {
        try {
            return compteUtilisateurService.findByDocumentId(documentId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CompteUtilisateurDTO> getCompteByEmail(@PathVariable String email) {
        try {
            return compteUtilisateurService.findByEmail(email)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<CompteUtilisateurDTO> createCompte(@RequestBody CompteUtilisateurDTO compteDTO) {
        try {
            if (compteUtilisateurService.existsByEmail(compteDTO.getEmail())) {
                return ResponseEntity.badRequest().body(null);
            }

            // S'assurer que le statut est ACTIF par défaut
            compteDTO.setStatut(StatutEntite.ACTIF);
            CompteUtilisateurDTO savedCompte = compteUtilisateurService.createCompteUtilisateur(compteDTO);
            return ResponseEntity.ok(savedCompte);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<CompteUtilisateurDTO> authenticate(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().build();
            }

            return compteUtilisateurService.authenticate(email, password)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<CompteUtilisateurDTO> updateCompte(@PathVariable String documentId, @RequestBody CompteUtilisateurDTO compteDTO) {
        try {
            if (!compteUtilisateurService.findByDocumentId(documentId).isPresent()) {
                return ResponseEntity.notFound().build();
            }

            compteDTO.setDocumentId(documentId);
            CompteUtilisateurDTO updatedCompte = compteUtilisateurService.save(compteDTO);
            return ResponseEntity.ok(updatedCompte);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{documentId}/password")
    public ResponseEntity<CompteUtilisateurDTO> updatePassword(@PathVariable String documentId, @RequestBody Map<String, String> passwordData) {
        try {
            String newPassword = passwordData.get("newPassword");
            
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            CompteUtilisateurDTO updatedCompte = compteUtilisateurService.updatePassword(documentId, newPassword);
            return ResponseEntity.ok(updatedCompte);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteCompte(@PathVariable String documentId) {
        try {
            if (!compteUtilisateurService.findByDocumentId(documentId).isPresent()) {
                return ResponseEntity.notFound().build();
            }

            compteUtilisateurService.deleteByDocumentId(documentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // NOUVEAUX ENDPOINTS POUR LA GESTION DU STATUT
    @PutMapping("/{documentId}/desactiver")
    public ResponseEntity<CompteUtilisateurDTO> desactiverCompte(@PathVariable String documentId) {
        try {
            CompteUtilisateurDTO compte = compteUtilisateurService.desactiver(documentId);
            return compte != null ? ResponseEntity.ok(compte) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{documentId}/activer")
    public ResponseEntity<CompteUtilisateurDTO> activerCompte(@PathVariable String documentId) {
        try {
            CompteUtilisateurDTO compte = compteUtilisateurService.activer(documentId);
            return compte != null ? ResponseEntity.ok(compte) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<CompteUtilisateurDTO>> getComptesByStatut(@PathVariable StatutEntite statut) {
        try {
            List<CompteUtilisateurDTO> comptes = compteUtilisateurService.findByStatut(statut);
            return ResponseEntity.ok(comptes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/inactifs")
    public ResponseEntity<List<CompteUtilisateurDTO>> getComptesInactifs() {
        try {
            List<CompteUtilisateurDTO> comptes = compteUtilisateurService.findByStatut(StatutEntite.INACTIF);
            return ResponseEntity.ok(comptes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ENDPOINTS EXISTANTS
    @GetMapping("/type/{typeCompte}")
    public ResponseEntity<List<CompteUtilisateurDTO>> getComptesByType(@PathVariable CompteUtilisateur.TypeCompte typeCompte) {
        try {
            List<CompteUtilisateurDTO> comptes = compteUtilisateurService.findByTypeCompte(typeCompte);
            return ResponseEntity.ok(comptes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/entity/{entityDocumentId}")
    public ResponseEntity<List<CompteUtilisateurDTO>> getComptesByEntity(@PathVariable String entityDocumentId) {
        try {
            List<CompteUtilisateurDTO> comptes = compteUtilisateurService.findByEntityDocumentId(entityDocumentId);
            return ResponseEntity.ok(comptes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/entity/{entityDocumentId}/type/{entityType}")
    public ResponseEntity<CompteUtilisateurDTO> getCompteByEntityAndType(
            @PathVariable String entityDocumentId,
            @PathVariable CompteUtilisateur.TypeCompte entityType) {
        try {
            return compteUtilisateurService.findByEntity(entityDocumentId, entityType)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        try {
            boolean exists = compteUtilisateurService.existsByEmail(email);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/create-for-entity")
    public ResponseEntity<CompteUtilisateurDTO> createCompteForEntity(@RequestBody Map<String, String> requestData) {
        try {
            String email = requestData.get("email");
            String password = requestData.get("password");
            String typeCompteStr = requestData.get("typeCompte");
            String entityDocumentId = requestData.get("entityDocumentId");

            if (email == null || password == null || typeCompteStr == null || entityDocumentId == null) {
                return ResponseEntity.badRequest().build();
            }

            CompteUtilisateur.TypeCompte typeCompte = CompteUtilisateur.TypeCompte.valueOf(typeCompteStr);
            CompteUtilisateurDTO compte = compteUtilisateurService.createCompteForEntity(email, password, typeCompte, entityDocumentId);
            return ResponseEntity.ok(compte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}