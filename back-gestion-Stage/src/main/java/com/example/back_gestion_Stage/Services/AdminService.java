package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Admin;
import com.example.back_gestion_Stage.DTOs.AdminDTO;
import com.example.back_gestion_Stage.Repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdminService extends BaseService<Admin, AdminDTO> {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    protected AdminRepository getRepository() {
        return adminRepository;
    }

    @Override
    protected AdminDTO convertToDto(Admin entity) {
        AdminDTO dto = new AdminDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setNom(entity.getNom());
        dto.setPrenom(entity.getPrenom());
        dto.setEmail(entity.getEmail());
        dto.setTelephone(entity.getTelephone());
        dto.setCin(entity.getCin());
        dto.setFonction(entity.getFonction());
        dto.setStatut(entity.getStatut());
        return dto;
    }

    @Override
    protected Admin convertToEntity(AdminDTO dto) {
        Admin entity = new Admin();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        entity.setEmail(dto.getEmail());
        entity.setTelephone(dto.getTelephone());
        entity.setCin(dto.getCin());
        entity.setFonction(dto.getFonction());
        entity.setStatut(dto.getStatut());
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(Admin entity, AdminDTO dto) {
        if (dto.getNom() != null) entity.setNom(dto.getNom());
        if (dto.getPrenom() != null) entity.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getTelephone() != null) entity.setTelephone(dto.getTelephone());
        if (dto.getCin() != null) entity.setCin(dto.getCin());
        if (dto.getFonction() != null) entity.setFonction(dto.getFonction());
        if (dto.getStatut() != null) entity.setStatut(dto.getStatut());
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt
    }

    @Override
    public Optional<AdminDTO> findByDocumentId(String documentId) {
        return adminRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public Optional<AdminDTO> findByEmail(String email) {
        return adminRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    public boolean existsByEmail(String email) {
        return adminRepository.existsByEmail(email);
    }

    public boolean existsByCin(String cin) {
        return adminRepository.existsByCin(cin);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        adminRepository.findByDocumentId(documentId)
                .ifPresent(admin -> adminRepository.deleteById(admin.getId()));
    }
}