package org.example.smartexpensebackend.service;

import org.example.smartexpensebackend.entity.ExpenseGroup;
import org.example.smartexpensebackend.entity.User;
import org.example.smartexpensebackend.repository.ExpenseGroupRepository;
import org.example.smartexpensebackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseGroupService {

    private final ExpenseGroupRepository groupRepository;
    private final UserRepository userRepository;

    public ExpenseGroupService(
            ExpenseGroupRepository groupRepository,
            UserRepository userRepository) {

        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public ExpenseGroup createGroup(
            String name,
            String description,
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ExpenseGroup group =
                new ExpenseGroup(name, description, user);


        group.getMembers().add(user);

        return groupRepository.save(group);
    }

    public List<ExpenseGroup> getAllGroups() {
        return groupRepository.findAll();
    }

    public List<ExpenseGroup> getGroupsByUser(Long userId) {
        return groupRepository.findByCreatedById(userId);
    }

    public ExpenseGroup getGroupById(Long id) {

        return groupRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Group not found"));
    }

    public ExpenseGroup addMember(
            Long groupId,
            Long userId) {

        ExpenseGroup group = getGroupById(groupId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!group.getMembers().contains(user)) {
            group.getMembers().add(user);
        }

        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {
        groupRepository.deleteById(id);
    }
}