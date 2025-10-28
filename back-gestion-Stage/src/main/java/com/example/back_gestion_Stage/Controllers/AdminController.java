package com.example.back_gestion_Stage.Controllers;

import com.example.back_gestion_Stage.DTOs.AdminDTO;
import com.example.back_gestion_Stage.Services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminDTO>> getAllAdmins() {
        List<AdminDTO> admins = adminService.findAll();
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<AdminDTO> getAdminByDocumentId(@PathVariable String documentId) {
        return adminService.findByDocumentId(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AdminDTO> getAdminByEmail(@PathVariable String email) {
        return adminService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AdminDTO> createAdmin(@RequestBody AdminDTO adminDTO) {
        // Vérifier si l'email existe déjà
        if (adminService.existsByEmail(adminDTO.getEmail())) {
            return ResponseEntity.badRequest().body(null);
        }
        
        // Vérifier si le CIN existe déjà
        if (adminService.existsByCin(adminDTO.getCin())) {
            return ResponseEntity.badRequest().body(null);
        }

        AdminDTO savedAdmin = adminService.save(adminDTO);
        return ResponseEntity.ok(savedAdmin);
    }

    @PutMapping("/{documentId}")
    public ResponseEntity<AdminDTO> updateAdmin(@PathVariable String documentId, @RequestBody AdminDTO adminDTO) {
        if (!adminService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // S'assurer que le documentId reste cohérent
        adminDTO.setDocumentId(documentId);
        AdminDTO updatedAdmin = adminService.save(adminDTO);
        return ResponseEntity.ok(updatedAdmin);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String documentId) {
        if (!adminService.findByDocumentId(documentId).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        adminService.deleteByDocumentId(documentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = adminService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/check-cin/{cin}")
    public ResponseEntity<Boolean> checkCinExists(@PathVariable String cin) {
        boolean exists = adminService.existsByCin(cin);
        return ResponseEntity.ok(exists);
    }
}