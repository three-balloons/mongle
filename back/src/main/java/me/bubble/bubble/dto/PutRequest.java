package me.bubble.bubble.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PutRequest { // delete, update, create는 요청에서 오는 배열의 이름과 똑같아야 함.
    private List<PutDeleteRequest> delete;
    private List<PutUpdateRequest> update;
    private List<PutCreateRequest> create;
}
