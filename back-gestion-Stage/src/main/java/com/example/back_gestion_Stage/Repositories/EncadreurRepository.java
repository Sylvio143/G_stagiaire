// EncadreurRepository.java
package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.Encadreur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EncadreurRepository extends JpaRepository<Encadreur, Long> {
    Optional<Encadreur> findByDocumentId(String documentId);
    Optional<Encadreur> findByEmail(String email);
    Optional<Encadreur> findByCin(String cin);
    List<Encadreur> findBySuperieurHierarchiqueDocumentId(String superieurDocumentId);
    List<Encadreur> findByDepartement(String departement);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
    
    @Query("SELECT e FROM Encadreur e LEFT JOIN FETCH e.superieurHierarchique")
    List<Encadreur> findAllWithSuperieur();
    @Query("SELECT e FROM Encadreur e LEFT JOIN FETCH e.superieurHierarchique LEFT JOIN FETCH e.photo")
List<Encadreur> findAllWithRelations();
}