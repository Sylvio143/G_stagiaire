// AdminRepository.java
package com.example.back_gestion_Stage.Repositories;

import com.example.back_gestion_Stage.Entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByDocumentId(String documentId);
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByCin(String cin);
    boolean existsByEmail(String email);
    boolean existsByCin(String cin);
}