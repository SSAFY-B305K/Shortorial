import styled from "styled-components";
import Video from "./Video";
import Camera from "./Camera";
import SectionButton from "./SectionButton";

// 영상의 9 : 16 비율을 맞춤 그러나 상하 여백 생김
// 비디오 가로 사이즈가 반응형으로 움직임
// 여백 1 : 비디오 2 : 여백 1

const LearnPage1 = () => {
  return (
    <Container>
      <ButtonSection>
        <SectionButtonList>
          <SectionButton />
          <SectionButton />
          <SectionButton />
          <SectionButton />
        </SectionButtonList>
      </ButtonSection>
      <VideoSection>
        <VideoContainer>
          <Video src="src/assets/sample.mp4"></Video>
        </VideoContainer>
        <VideoContainer>
          <Camera />
        </VideoContainer>
      </VideoSection>
      <RightSection></RightSection>
    </Container>
  );
};

const SectionButtonList = styled.section`
  button {
    margin: 8px;
  }
`;

const RightSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;

  flex: 1;
`;

const ButtonSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  width: 50%;
  /* height: 100%; */

  video {
    width: 100%;
    height: 100%;
  }
`;

const VideoSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /* width: 100%; */
  /* height: 100%; */
  flex: 2;

  /* @media screen and (min-width: 480px) {
    width: 430px;
  }

  @media screen and (min-width: 768px) {
    width: 600px;
  }

  @media screen and (min-width: 1024px) {
    width: 700px;
  } */
`;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #000;
`;

export default LearnPage1;
