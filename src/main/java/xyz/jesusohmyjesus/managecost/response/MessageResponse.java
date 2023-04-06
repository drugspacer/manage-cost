package xyz.jesusohmyjesus.managecost.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse<T> {
    private String message;
    private T data;

    public MessageResponse(T data) {
        this.data = data;
    }
}
