package xyz.jesusohmyjesus.managecost.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import xyz.jesusohmyjesus.managecost.validation.NotEquals;

@Data
@NotEquals(field = "password", fieldMatch = "oldPassword")
public class PasswordRq {
    @Size(min = 8)
    private String oldPassword;

    @Size(min = 8)
    private String password;
}
