package com.example.back_gestion_Stage.Services;

import com.example.back_gestion_Stage.Entities.CompteUtilisateur;
import com.example.back_gestion_Stage.DTOs.CompteUtilisateurDTO;
import com.example.back_gestion_Stage.Entities.StatutEntite;
import com.example.back_gestion_Stage.Repositories.CompteUtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CompteUtilisateurService extends BaseService<CompteUtilisateur, CompteUtilisateurDTO> {

    @Autowired
    private CompteUtilisateurRepository compteUtilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected CompteUtilisateurRepository getRepository() {
        return compteUtilisateurRepository;
    }

    @Override
    protected CompteUtilisateurDTO convertToDto(CompteUtilisateur entity) {
        CompteUtilisateurDTO dto = new CompteUtilisateurDTO();
        dto.setId(entity.getId());
        dto.setDocumentId(entity.getDocumentId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setEmail(entity.getEmail());
        dto.setTypeCompte(entity.getTypeCompte());
        dto.setEntityDocumentId(entity.getEntityDocumentId());
        dto.setEntityType(entity.getEntityType());
        dto.setStatut(entity.getStatut());
        return dto;
    }

    @Override
    protected CompteUtilisateur convertToEntity(CompteUtilisateurDTO dto) {
        CompteUtilisateur entity = new CompteUtilisateur();
        entity.setId(dto.getId());
        entity.setDocumentId(dto.getDocumentId());
        entity.setEmail(dto.getEmail());
        entity.setStatut(dto.getStatut());
        
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
            entity.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        } else if (dto.getId() != null) {
            compteUtilisateurRepository.findById(dto.getId())
                .ifPresent(existingCompte -> entity.setMotDePasse(existingCompte.getMotDePasse()));
        }
        
        entity.setTypeCompte(dto.getTypeCompte());
        entity.setEntityDocumentId(dto.getEntityDocumentId());
        entity.setEntityType(dto.getEntityType());
        return entity;
    }

    // NOUVELLE MÉTHODE POUR LA MISE À JOUR
    @Override
    protected void updateEntityFromDto(CompteUtilisateur entity, CompteUtilisateurDTO dto) {
        if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
        if (dto.getStatut() != null) entity.setStatut(dto.getStatut());
        if (dto.getTypeCompte() != null) entity.setTypeCompte(dto.getTypeCompte());
        if (dto.getEntityDocumentId() != null) entity.setEntityDocumentId(dto.getEntityDocumentId());
        if (dto.getEntityType() != null) entity.setEntityType(dto.getEntityType());
        
        // Gestion spéciale du mot de passe
        if (dto.getMotDePasse() != null && !dto.getMotDePasse().isEmpty()) {
            entity.setMotDePasse(passwordEncoder.encode(dto.getMotDePasse()));
        }
        // Ne pas mettre à jour : id, documentId, createdAt, updatedAt
    }

    // MÉTHODE AJOUTÉE POUR CORRIGER L'ERREUR
    public List<CompteUtilisateurDTO> findByEntityDocumentId(String entityDocumentId) {
        return compteUtilisateurRepository.findByEntityDocumentId(entityDocumentId)
                .stream()
                .filter(compte -> compte.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Les autres méthodes restent inchangées...
    public List<CompteUtilisateurDTO> findAllActifs() {
        return compteUtilisateurRepository.findAll().stream()
                .filter(compte -> compte.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<CompteUtilisateurDTO> findByEmail(String email) {
        return compteUtilisateurRepository.findByEmail(email)
                .filter(compte -> compte.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto);
    }

    public List<CompteUtilisateurDTO> findByTypeCompte(CompteUtilisateur.TypeCompte typeCompte) {
        return compteUtilisateurRepository.findByTypeCompte(typeCompte)
                .stream()
                .filter(compte -> compte.getStatut() == StatutEntite.ACTIF)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean existsByEmail(String email) {
        return compteUtilisateurRepository.findByEmail(email)
                .map(compte -> compte.getStatut() == StatutEntite.ACTIF)
                .orElse(false);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public CompteUtilisateurDTO createCompteUtilisateur(CompteUtilisateurDTO compteDTO) {
        if (existsByEmail(compteDTO.getEmail())) {
            throw new RuntimeException("Un compte avec cet email existe déjà");
        }
        
        if (compteDTO.getMotDePasse() == null || compteDTO.getMotDePasse().isEmpty()) {
            throw new RuntimeException("Le mot de passe est obligatoire");
        }
        
        CompteUtilisateur entity = convertToEntity(compteDTO);
        CompteUtilisateur savedEntity = compteUtilisateurRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public Optional<CompteUtilisateurDTO> authenticate(String email, String password) {
        Optional<CompteUtilisateur> compteOpt = compteUtilisateurRepository.findByEmail(email);
        
        if (compteOpt.isPresent()) {
            CompteUtilisateur compte = compteOpt.get();
            if (compte.getStatut() == StatutEntite.ACTIF && 
                verifyPassword(password, compte.getMotDePasse())) {
                return Optional.of(convertToDto(compte));
            }
        }
        
        return Optional.empty();
    }

    public CompteUtilisateurDTO updatePassword(String documentId, String newPassword) {
        Optional<CompteUtilisateur> compteOpt = compteUtilisateurRepository.findByDocumentId(documentId);
        
        if (compteOpt.isPresent()) {
            CompteUtilisateur compte = compteOpt.get();
            compte.setMotDePasse(passwordEncoder.encode(newPassword));
            CompteUtilisateur savedCompte = compteUtilisateurRepository.save(compte);
            return convertToDto(savedCompte);
        }
        
        throw new RuntimeException("Compte utilisateur non trouvé");
    }

    @Override
    public void deleteByDocumentId(String documentId) {
        compteUtilisateurRepository.findByDocumentId(documentId)
                .ifPresent(compte -> compteUtilisateurRepository.deleteById(compte.getId()));
    }

    public CompteUtilisateurDTO desactiver(String documentId) {
        Optional<CompteUtilisateur> compteOpt = compteUtilisateurRepository.findByDocumentId(documentId);
        if (compteOpt.isPresent()) {
            CompteUtilisateur compte = compteOpt.get();
            compte.setStatut(StatutEntite.INACTIF);
            CompteUtilisateur savedCompte = compteUtilisateurRepository.save(compte);
            return convertToDto(savedCompte);
        }
        return null;
    }

    public CompteUtilisateurDTO activer(String documentId) {
        Optional<CompteUtilisateur> compteOpt = compteUtilisateurRepository.findByDocumentId(documentId);
        if (compteOpt.isPresent()) {
            CompteUtilisateur compte = compteOpt.get();
            compte.setStatut(StatutEntite.ACTIF);
            CompteUtilisateur savedCompte = compteUtilisateurRepository.save(compte);
            return convertToDto(savedCompte);
        }
        return null;
    }

    public List<CompteUtilisateurDTO> findByStatut(StatutEntite statut) {
        return compteUtilisateurRepository.findAll().stream()
                .filter(compte -> compte.getStatut() == statut)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CompteUtilisateurDTO createCompteForEntity(String email, String password, 
                                                    CompteUtilisateur.TypeCompte typeCompte, 
                                                    String entityDocumentId) {
        CompteUtilisateurDTO compteDTO = new CompteUtilisateurDTO();
        compteDTO.setEmail(email);
        compteDTO.setMotDePasse(password);
        compteDTO.setTypeCompte(typeCompte);
        compteDTO.setEntityDocumentId(entityDocumentId);
        compteDTO.setEntityType(typeCompte);
        compteDTO.setStatut(StatutEntite.ACTIF);
        
        return createCompteUtilisateur(compteDTO);
    }

    public Optional<CompteUtilisateurDTO> findByEntity(String entityDocumentId, CompteUtilisateur.TypeCompte entityType) {
        return compteUtilisateurRepository.findByEntityDocumentIdAndEntityType(entityDocumentId, entityType)
                .stream()
                .filter(compte -> compte.getStatut() == StatutEntite.ACTIF)
                .findFirst()
                .map(this::convertToDto);
    }
}