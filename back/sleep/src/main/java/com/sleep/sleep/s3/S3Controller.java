package com.sleep.sleep.s3;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class S3Controller {
    private final S3Service s3Service;

    @Operation(summary = "동영상 다운로드", description ="추후 사용자별 다운로드로 수정 예정; param: 다운로드할 파일이름")
    @GetMapping("/s3/download/{fileName}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileName) {
        try {
            String filePath = s3Service.getPath(fileName);
            return new ResponseEntity<String>(filePath, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Operation(summary = "동영상 업로드", description ="추후 사용자별 업로드로 수정 예정; param: 업로드할 파일이름")
    @PostMapping("/s3/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("fileName") String fileName) {
        try {
            String uploadUrl = s3Service.uploadFile(file, fileName);
            return new ResponseEntity<String>(uploadUrl, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "동영상 삭제", description ="추후 사용자별 다운로드로 수정 예정; param: 삭제할 파일이름")
    @DeleteMapping("/s3/delete/{fileName}")
    public ResponseEntity<?> deleteFile(@PathVariable String fileName){
        try {
            s3Service.deleteFile(fileName);
            return new ResponseEntity<String>("Successfully delete!",HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}