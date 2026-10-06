package org.example.smartexpensebackend.repository;

import org.example.smartexpensebackend.entity.ExpenseGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseGroupRepository extends JpaRepository<ExpenseGroup, Long> {

    List<ExpenseGroup> findByCreatedById(Long userId);
}