package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.SuperieurHierarchique;
import com.example.back_gestion_Stage.DTOs.SuperieurHierarchiqueDTO;
import com.example.back_gestion_Stage.Repositories.SuperieurHierarchiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SuperieurHierarchiqueService extends BaseService<SuperieurHierarchique, SuperieurHierarchiqueDTO> {

    @Autowired
    private SuperieurHierarchiqueRepository superieurHierarchiqueRepository;

    @Override
    protected SuperieurHierarchiqueRepository getRepository() {
        return superieurHierarchiqueRepository;
    }

    @Override
    protected SuperieurHierarchiqueDTO convertToDto(SuperieurHierarchique entity) {
        SuperieurHierarchiqueDTO dto = new SuperieurHierarchiqueDTO();
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
        dto.setDepartement(entity.getDepartement());
        
        dto.setPhotoUrl(entity.getPhotoUrl());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
        dto.setMediumPhotoUrl(entity.getMediumPhotoUrl());
        
        return dto;
    }

    @Override
    protected SuperieurHierarchique convertToEntity(SuperieurHierarchiqueDTO dto) {
        SuperieurHierarchique entity = new SuperieurHierarchique();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        entity.setEmail(dto.getEmail());
        entity.setTelephone(dto.getTelephone());
        entity.setCin(dto.getCin());
        entity.setFonction(dto.getFonction());
        entity.setDepartement(dto.getDepartement());
        
        // Note: La photo sera gérée séparément
        return entity;
    }

    @Override
    public Optional<SuperieurHierarchiqueDTO> findByDocumentId(String documentId) {
        return superieurHierarchiqueRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public Optional<SuperieurHierarchiqueDTO> findByEmail(String email) {
        return superieurHierarchiqueRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    public Optional<SuperieurHierarchiqueDTO> findByCin(String cin) {
        return superieurHierarchiqueRepository.findByCin(cin)
                .map(this::convertToDto);
    }

    public List<SuperieurHierarchiqueDTO> findByDepartement(String departement) {
        return superieurHierarchiqueRepository.findByDepartement(departement)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<SuperieurHierarchiqueDTO> findAllWithPhoto() {
        return superieurHierarchiqueRepository.findAllWithPhoto()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return superieurHierarchiqueRepository.existsByEmail(email);
    }

    public boolean existsByCin(String cin) {
        return superieurHierarchiqueRepository.existsByCin(cin);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        superieurHierarchiqueRepository.findByDocumentId(documentId)
                .ifPresent(superieur -> superieurHierarchiqueRepository.deleteById(superieur.getId()));
    }

    public long countByDepartement(String departement) {
        return superieurHierarchiqueRepository.findByDepartement(departement).size();
    }

    public long countTotal() {
        return superieurHierarchiqueRepository.count();
    }
}