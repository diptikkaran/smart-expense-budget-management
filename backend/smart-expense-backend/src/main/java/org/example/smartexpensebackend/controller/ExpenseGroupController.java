package org.example.smartexpensebackend.controller;

import org.example.smartexpensebackend.entity.ExpenseGroup;
import org.example.smartexpensebackend.service.ExpenseGroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseGroupController {

    private final ExpenseGroupService groupService;

    public ExpenseGroupController(ExpenseGroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ExpenseGroup createGroup(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam Long userId) {

        return groupService.createGroup(
                name,
                description,
                userId
        );
    }

    @GetMapping
    public List<ExpenseGroup> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/user/{userId}")
    public List<ExpenseGroup> getGroupsByUser(
            @PathVariable Long userId) {

        return groupService.getGroupsByUser(userId);
    }

    @GetMapping("/{id}")
    public ExpenseGroup getGroupById(
            @PathVariable Long id) {

        return groupService.getGroupById(id);
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ExpenseGroup addMember(
            @PathVariable Long groupId,
            @PathVariable Long userId) {

        return groupService.addMember(
                groupId,
                userId
        );
    }

    @DeleteMapping("/{id}")
    public String deleteGroup(
            @PathVariable Long id) {

        groupService.deleteGroup(id);

        return "Group deleted successfully";
    }
}