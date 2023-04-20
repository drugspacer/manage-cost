package xyz.jesusohmyjesus.managecost.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.jesusohmyjesus.managecost.entities.Tag;
import xyz.jesusohmyjesus.managecost.repository.TagRepository;
import xyz.jesusohmyjesus.managecost.response.MessageResponse;

@io.swagger.v3.oas.annotations.tags.Tag(name = "Dictionary endpoints")
@RestController
@RequestMapping(Endpoints.API)
public class DictionaryController {
    @Autowired
    private TagRepository tagRepository;

    @Operation(description = "Get all tags for activity")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "get tags")})
    @GetMapping(Endpoints.TAGS)
    public MessageResponse<Iterable<Tag>> getTags() {
        return new MessageResponse<>(tagRepository.findAll());
    }
}
