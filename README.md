# 업무작업대 (Workbench)

_문서 편집 외 여러 업무 지원을 위한 Mac 및 Windows용 데스크톱 앱_

![](./screenshot.png)

## 업데이트 및 공지사항

-   2023/11/20 마크다운 문서 편집 기능 ([v1.0](https://github.com/yuu2dev/workbench/releases))

## 설치 및 실행

> node 16.20.1^ 기준

```
// 패키지 설치하기
npm run setup

// 개발하기
npm run serve

// 빌드하기
npm run build
```

그 외 부가 명령어

```
// input 경로의 아이콘을 electron 전용 아이콘들로 일괄 생성 해줌
npm run icon

// 출시하는 단말기 환경변수 GH_TOKEN 이 선언되어 있어야함
npm run deploy
```
