package xyz.jesusohmyjesus.managecost.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.math.BigDecimal;

@Target({ ElementType.FIELD })
@Constraint(validatedBy = NullPositiveOrZero.NullPositiveOrZeroValidator.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface NullPositiveOrZero {
    String message() default "{validation.nullPositiveOrZero}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class NullPositiveOrZeroValidator implements ConstraintValidator<NullPositiveOrZero, BigDecimal> {
        @Override
        public boolean isValid(BigDecimal value, ConstraintValidatorContext context) {
            return value == null || value.compareTo(BigDecimal.ZERO) > -1;
        }
    }
}
