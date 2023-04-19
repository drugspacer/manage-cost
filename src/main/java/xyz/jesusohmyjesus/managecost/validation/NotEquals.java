package xyz.jesusohmyjesus.managecost.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import org.springframework.beans.BeanWrapperImpl;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NotEquals.NotEqualsValidator.class)
public @interface NotEquals {
    String message() default "{validation.notEquals}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String field();

    String fieldMatch();

    @Target({ ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @interface List {
        NotEquals[] value();
    }

    class NotEqualsValidator implements ConstraintValidator<NotEquals, Object> {
        private String field;
        private String fieldMatch;

        @Override
        public void initialize(NotEquals constraintAnnotation) {
            this.field = constraintAnnotation.field();
            this.fieldMatch = constraintAnnotation.fieldMatch();
        }

        @Override
        public boolean isValid(Object value, ConstraintValidatorContext context) {
            Object fieldValue = new BeanWrapperImpl(value)
                    .getPropertyValue(field);
            if (fieldValue != null) {
                return !fieldValue.equals(new BeanWrapperImpl(value)
                        .getPropertyValue(fieldMatch));
            }
            return true;
        }
    }
}
