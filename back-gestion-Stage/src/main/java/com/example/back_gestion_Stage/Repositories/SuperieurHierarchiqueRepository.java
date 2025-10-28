package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.SuperieurHierarchique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SuperieurHierarchiqueRepository extends JpaRepository<SuperieurHierarchique, Long> {
    Optional<SuperieurHierarchique> findByDocumentId(String documentId);
    Optional<SuperieurHierarchique> findByEmail(String email);
    Optional<SuperieurHierarchique> findByCin(String cin);
    List<SuperieurHierarchique> findByDepartement(String departement);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
    
    @Query("SELECT s FROM SuperieurHierarchique s LEFT JOIN FETCH s.photo")
    List<SuperieurHierarchique> findAllWithPhoto();
}