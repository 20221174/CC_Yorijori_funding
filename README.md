# Redis 서버 실행 및 기본 사용법

본 프로젝트에서는 Redis를 세션 저장소로 사용하고 있습니다. Redis 서버 실행과 기본 명령어 사용법은 아래와 같습니다.

---

## 1. Redis 서버 설치

```bash
sudo apt update
sudo apt install redis-server
```

---

## 2. Redis 서버 실행

### 2-1. 수동 실행 (터미널에서 직접 실행)

```bash
redis-server
```

* 포그라운드 실행, 종료는 `Ctrl + C`

### 2-2. 백그라운드 실행 (데몬 모드)

```bash
redis-server --daemonize yes
```

---

## 3. Redis 서버 종료

```bash
redis-cli shutdown
```

또는

```bash
ps aux | grep redis
kill <PID>
```

---

## 4. Redis 기본 데이터 조회 및 검색

Redis CLI를 사용하여 데이터를 확인할 수 있습니다.

### 4-1. Redis CLI 접속

```bash
redis-cli
```

### 4-2. 키 목록 조회

```bash
keys *
```

* 모든 키를 조회합니다. (운영 환경에선 주의해서 사용)

### 4-3. 특정 키 조회

```bash
get <키이름>
```

* 문자열 타입의 키 값을 조회합니다.

### 4-4. 해시 타입 조회

```bash
hgetall <키이름>
```

* 해시(Hash) 타입 키의 모든 필드와 값을 조회합니다.

### 4-5. 세션 키 확인 예시

* 세션은 보통 `sess:<세션ID>` 형식으로 저장되므로 다음과 같이 조회할 수 있습니다.

```bash
keys sess:*
hgetall sess:<세션ID>
```
