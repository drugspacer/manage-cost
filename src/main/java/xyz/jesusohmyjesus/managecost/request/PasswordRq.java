package xyz.jesusohmyjesus.managecost.request;

import lombok.Data;

@Data
public class PasswordRq {
    private String oldPassword;
    private String password;
}
