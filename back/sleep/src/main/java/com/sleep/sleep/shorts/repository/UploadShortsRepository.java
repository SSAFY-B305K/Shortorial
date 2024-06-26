package com.sleep.sleep.shorts.repository;

import com.sleep.sleep.shorts.entity.UploadShorts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadShortsRepository extends JpaRepository<UploadShorts,Integer> {
    UploadShorts findByUploadNo(int uploadNo);

    @Query(nativeQuery = true, value = "select * from upload_shorts where member_no = :memberIndex order by upload_no desc")
    List<UploadShorts> findUploadShortList(@Param("memberIndex") int memberIndex);

    @Query(nativeQuery = true, value = "select * from upload_shorts where upload_no = :uploadNo and upload_title = :uploadTitle")
    UploadShorts findByUploadTitle(@Param("uploadNo") int uploadNo, @Param("uploadTitle") String uploadTitle);

    @Query("SELECT COUNT(u) > 0 FROM UploadShorts u WHERE u.uploadTitle = :uploadTitle")
    boolean existsByUploadTitle(@Param("uploadTitle") String uploadTitle);

    @Query("SELECT COUNT(us.youtubeUrl) FROM UploadShorts us WHERE us.memberIndex.memberIndex = :memberIndex AND us.youtubeUrl IS NOT NULL")
    int countYoutubeUrlByMemberIndex(int memberIndex);

    @Query("SELECT COUNT(us) FROM UploadShorts us WHERE us.memberIndex.memberIndex = :memberIndex")
    int countUploadShortsByMemberIndex(int memberIndex);

}
