package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Encadreur;
import com.example.back_gestion_Stage.Entities.SuperieurHierarchique;
import com.example.back_gestion_Stage.DTOs.EncadreurDTO;
import com.example.back_gestion_Stage.Repositories.EncadreurRepository;
import com.example.back_gestion_Stage.Repositories.SuperieurHierarchiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EncadreurService extends BaseService<Encadreur, EncadreurDTO> {

    @Autowired
    private EncadreurRepository encadreurRepository;

    @Autowired
    private SuperieurHierarchiqueRepository superieurHierarchiqueRepository;

    @Override
    protected EncadreurRepository getRepository() {
        return encadreurRepository;
    }

    @Override
    protected EncadreurDTO convertToDto(Encadreur entity) {
        EncadreurDTO dto = new EncadreurDTO();
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
        dto.setSpecialite(entity.getSpecialite());
        
        // Charger la relation avec le supérieur hiérarchique
        if (entity.getSuperieurHierarchique() != null) {
            dto.setSuperieurHierarchiqueDocumentId(entity.getSuperieurHierarchique().getDocumentId());
        }
        
        dto.setPhotoUrl(entity.getPhotoUrl());
        dto.setThumbnailUrl(entity.getThumbnailUrl());
        dto.setMediumPhotoUrl(entity.getMediumPhotoUrl());
        
        return dto;
    }

    @Override
    protected Encadreur convertToEntity(EncadreurDTO dto) {
        Encadreur entity = new Encadreur();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setNom(dto.getNom());
        entity.setPrenom(dto.getPrenom());
        entity.setEmail(dto.getEmail());
        entity.setTelephone(dto.getTelephone());
        entity.setCin(dto.getCin());
        entity.setFonction(dto.getFonction());
        entity.setDepartement(dto.getDepartement());
        entity.setSpecialite(dto.getSpecialite());
        
        // Établir la relation avec le supérieur hiérarchique
        if (dto.getSuperieurHierarchiqueDocumentId() != null) {
            superieurHierarchiqueRepository.findByDocumentId(dto.getSuperieurHierarchiqueDocumentId())
                .ifPresent(entity::setSuperieurHierarchique);
        }
        
        return entity;
    }

    // Méthode pour créer un encadreur avec relations
    @Transactional
    public EncadreurDTO createEncadreurWithRelations(EncadreurDTO encadreurDTO) {
        Encadreur encadreur = convertToEntity(encadreurDTO);
        Encadreur savedEncadreur = encadreurRepository.save(encadreur);
        return convertToDto(savedEncadreur);
    }

    // Surcharger la méthode save
    @Override
    @Transactional
    public EncadreurDTO save(EncadreurDTO dto) {
        return createEncadreurWithRelations(dto);
    }

    @Override
    public Optional<EncadreurDTO> findByDocumentId(String documentId) {
        return encadreurRepository.findByDocumentId(documentId)
                .map(this::convertToDto);
    }

    public Optional<EncadreurDTO> findByEmail(String email) {
        return encadreurRepository.findByEmail(email)
                .map(this::convertToDto);
    }

    public List<EncadreurDTO> findBySuperieurHierarchique(String superieurDocumentId) {
        return encadreurRepository.findBySuperieurHierarchiqueDocumentId(superieurDocumentId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EncadreurDTO> findByDepartement(String departement) {
        return encadreurRepository.findByDepartement(departement)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EncadreurDTO> findAllWithSuperieur() {
        return encadreurRepository.findAllWithSuperieur()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return encadreurRepository.existsByEmail(email);
    }

    public boolean existsByCin(String cin) {
        return encadreurRepository.existsByCin(cin);
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        encadreurRepository.findByDocumentId(documentId)
                .ifPresent(encadreur -> encadreurRepository.deleteById(encadreur.getId()));
    }
}