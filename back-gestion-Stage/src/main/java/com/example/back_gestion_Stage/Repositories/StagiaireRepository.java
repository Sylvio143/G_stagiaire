// StagiaireRepository.java
package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StagiaireRepository extends JpaRepository<Stagiaire, Long> {
    Optional<Stagiaire> findByDocumentId(String documentId);
    Optional<Stagiaire> findByEmail(String email);
    Optional<Stagiaire> findByCin(String cin);
    List<Stagiaire> findByEncadreurDocumentId(String encadreurDocumentId);
    List<Stagiaire> findByEcole(String ecole);
    List<Stagiaire> findByFiliere(String filiere);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
    
    @Query("SELECT s FROM Stagiaire s LEFT JOIN FETCH s.encadreur")
    List<Stagiaire> findAllWithEncadreur();
    @Query("SELECT s FROM Stagiaire s LEFT JOIN FETCH s.encadreur LEFT JOIN FETCH s.photo")
    List<Stagiaire> findAllWithRelations();
}