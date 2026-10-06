package org.example.smartexpensebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupBalanceDTO {

    private Long userId;
    private String userName;
    private Double totalPaid;
    private Double totalOwed;
    private Double balance;
}