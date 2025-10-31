package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.Encadreur;
import com.example.back_gestion_Stage.Entities.Stagiaire;
import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import com.example.back_gestion_Stage.DTOs.EncadreurDTO;
import com.example.back_gestion_Stage.Entities.StatutEntite;
import com.example.back_gestion_Stage.Repositories.EncadreurRepository;
import com.example.back_gestion_Stage.Repositories.StagiaireRepository;
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

    @Autowired
    private StagiaireRepository stagiaireRepository;

    @Autowired
    private CompteUtilisateurService compteUtilisateurService;

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
        dto.setStatut(entity.getStatut());
        
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
        entity.setStatut(dto.getStatut());
        
        if (dto.getSuperieurHierarchiqueDocumentId() != null) {
            superieurHierarchiqueRepository.findByDocumentId(dto.getSuperieurHierarchiqueDocumentId())
                .ifPresent(entity::setSuperieurHierarchique);
        }
        
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(Encadreur entity, EncadreurDTO dto) {
        if (dto.getNom() != null) entity.setNom(dto.getNom());
        if (dto.getPrenom() != null) entity.setPrenom(dto.getPrenom());
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getTelephone() != null) entity.setTelephone(dto.getTelephone());
        if (dto.getCin() != null) entity.setCin(dto.getCin());
        if (dto.getFonction() != null) entity.setFonction(dto.getFonction());
        if (dto.getDepartement() != null) entity.setDepartement(dto.getDepartement());
        if (dto.getSpecialite() != null) entity.setSpecialite(dto.getSpecialite());
        if (dto.getStatut() != null) entity.setStatut(dto.getStatut());
        if (dto.getSuperieurHierarchiqueDocumentId() != null) {
            // Si un nouveau documentId de superviseur est fourni, on met à jour la relation
            superieurHierarchiqueRepository.findByDocumentId(dto.getSuperieurHierarchiqueDocumentId())
                .ifPresent(entity::setSuperieurHierarchique);
        } else {
            // Si le superviseur est null dans le DTO, on supprime la relation
            entity.setSuperieurHierarchique(null);
        }
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt, photo, superieurHierarchique
    }

    // ... [le reste des méthodes reste inchangé] ...

    // Méthodes spécifiques avec filtrage par statut
    public List<EncadreurDTO> findAllActifs() {
        return encadreurRepository.findAll().stream()
                .filter(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<EncadreurDTO> findByEmail(String email) {
        return encadreurRepository.findByEmail(email)
                .filter(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto);
    }

    public List<EncadreurDTO> findBySuperieurHierarchique(String superieurDocumentId) {
        return encadreurRepository.findBySuperieurHierarchiqueDocumentId(superieurDocumentId)
                .stream()
                .filter(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return encadreurRepository.findByEmail(email)
                .map(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }

    public boolean existsByCin(String cin) {
        return encadreurRepository.findByCin(cin)
                .map(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }

    // Méthodes de gestion du statut
    public EncadreurDTO desactiver(String documentId) {
        Optional<Encadreur> encadreurOpt = encadreurRepository.findByDocumentId(documentId);
        if (encadreurOpt.isPresent()) {
            Encadreur encadreur = encadreurOpt.get();
            encadreur.setStatut(StatutEntite.INACTIF);
            Encadreur savedEncadreur = encadreurRepository.save(encadreur);
            
            // Désactiver le compte utilisateur associé
            compteUtilisateurService.findByEntity(encadreur.getDocumentId(), 
                    CompteUtilisateur.TypeCompte.ENCADREUR)
                .ifPresent(compte -> {
                    compteUtilisateurService.desactiver(compte.getDocumentId());
                });
            
            // Désactiver les stagiaires de cet encadreur
            List<Stagiaire> stagiaires = stagiaireRepository.findByEncadreurDocumentId(encadreur.getDocumentId());
            for (Stagiaire stagiaire : stagiaires) {
                stagiaire.setStatut(StatutEntite.INACTIF);
                stagiaireRepository.save(stagiaire);
                
                compteUtilisateurService.findByEntity(stagiaire.getDocumentId(), 
                        CompteUtilisateur.TypeCompte.STAGIAIRE)
                    .ifPresent(compte -> {
                        compteUtilisateurService.desactiver(compte.getDocumentId());
                    });
            }
            
            return convertToDto(savedEncadreur);
        }
        return null;
    }

    public EncadreurDTO activer(String documentId) {
        Optional<Encadreur> encadreurOpt = encadreurRepository.findByDocumentId(documentId);
        if (encadreurOpt.isPresent()) {
            Encadreur encadreur = encadreurOpt.get();
            encadreur.setStatut(StatutEntite.ACTIF);
            Encadreur savedEncadreur = encadreurRepository.save(encadreur);
            
            // Activer le compte utilisateur associé
            compteUtilisateurService.findByEntity(encadreur.getDocumentId(), 
                    CompteUtilisateur.TypeCompte.ENCADREUR)
                .ifPresent(compte -> {
                    compteUtilisateurService.activer(compte.getDocumentId());
                });
            
            return convertToDto(savedEncadreur);
        }
        return null;
    }

    public List<EncadreurDTO> findByStatut(StatutEntite statut) {
        return encadreurRepository.findAll().stream()
                .filter(encadreur -> encadreur.getStatut() == statut)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Autres méthodes inchangées
    public List<EncadreurDTO> findByDepartement(String departement) {
        return encadreurRepository.findByDepartement(departement)
                .stream()
                .filter(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<EncadreurDTO> findAllWithSuperieur() {
        return encadreurRepository.findAllWithSuperieur()
                .stream()
                .filter(encadreur -> encadreur.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        encadreurRepository.findByDocumentId(documentId)
                .ifPresent(encadreur -> encadreurRepository.deleteById(encadreur.getId()));
    }
}