package org.example.smartexpensebackend.repository;

import org.example.smartexpensebackend.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettlementRepository
        extends JpaRepository<Settlement, Long> {

    List<Settlement> findByGroupId(Long groupId);

    List<Settlement> findByPayerId(Long userId);

    List<Settlement> findByReceiverId(Long userId);
}