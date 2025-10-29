"use client"

import { useState, useEffect, useCallback } from "react"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SnowfallBackground } from "@/components/snowfall-background"
import { IntroAnimation } from "@/components/intro-animation"
import { SearchBar } from "@/components/search-bar"
import { KoreaMap } from "@/components/korea-map"
import { CityModal } from "@/components/city-modal"
import { RankingSidebar } from "@/components/ranking-sidebar"


const BACKEND_URL = "http://localhost:8080";

interface CityData {
  cityId: number
  cityName: string
  weatherStatus: string
  ptyCode: string
}

interface RankingCity {
  cityName: string
  score: number
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [cities, setCities] = useState<CityData[]>([])
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [rankingCities, setRankingCities] = useState<RankingCity[]>([])
  const [showRanking, setShowRanking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch map data
  const fetchMapData = useCallback(async () => {
    try {
      // --- [수정 2] URL 수정 ---
      const response = await fetch(`${BACKEND_URL}/api/v1/weather/map-data`);
      // ------------------------
      if (!response.ok) throw new Error("Failed to fetch map data");
      const data = await response.json();
      setCities(data);
      setError(null);
    } catch (err) {
      console.error("[SnowON] Error fetching map data:", err); // [v0] 대신 프로젝트 이름 사용
      setError("날씨 데이터를 불러오는데 실패했습니다.");
      // [선택사항] 개발 중 Mock 데이터 유지는 괜찮으나, 나중엔 제거하거나 분리
      // setCities([ ... mock data ... ]); // Mock 데이터 유지 또는 주석 처리
    }
  }, []);

  // Fetch ranking data
  // Fetch ranking data
  const fetchRankingData = async () => {
    try {
      // --- [수정 3] URL 수정 ---
      const response = await fetch(`${BACKEND_URL}/api/v1/ranking/popular-cities`);
      // ------------------------
      if (!response.ok) throw new Error("Failed to fetch ranking data");
      const data = await response.json();
      setRankingCities(data);
    } catch (err) {
      console.error("[SnowON] Error fetching ranking data:", err);
      // [선택사항] Mock 데이터 유지 또는 주석 처리
      // setRankingCities([ ... mock data ... ]);
    }
  };

  // Search handler
  // Search handler
  const handleSearch = async (query: string) => {
    try {
      // --- [수정 4] URL 수정 ---
      const response = await fetch(`${BACKEND_URL}/api/v1/search?query=${encodeURIComponent(query)}`);
      // ------------------------
      if (!response.ok) {
        // 404 등 검색 결과 없는 경우와 서버 에러 구분 필요 (백엔드 응답에 따라)
        // 우선 간단하게 에러로 처리
        throw new Error(`Search failed with status: ${response.status}`);
      }
      const data: CityData[] = await response.json(); // 백엔드는 List<SearchWeatherResult> 반환

      if (data && data.length > 0) {
        // 백엔드가 최대 1개만 반환하므로 첫 번째 결과를 사용
        setSelectedCity(data[0]);
      } else {
        // 백엔드가 빈 배열([])을 반환한 경우
        alert("검색 결과가 없습니다.");
        setSelectedCity(null); // 모달 닫기
      }

    } catch (err) {
      console.error("[SnowON] Error searching:", err);
      alert(`검색 중 오류가 발생했습니다: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setSelectedCity(null); // 에러 시 모달 닫기
      // [선택사항] Mock 데이터 제거
      /*
      const mockCity = cities.find((c) => c.cityName.includes(query))
      if (mockCity) {
        setSelectedCity(mockCity)
      } else {
        alert("검색 결과가 없습니다.")
      }
      */
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (showContent) {
      fetchMapData()
    }
  }, [showContent, fetchMapData])

  // Hourly update
  useEffect(() => {
    if (!showContent) return

    const now = new Date()
    const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000

    const initialTimer = setTimeout(() => {
      fetchMapData()

      const hourlyInterval = setInterval(
          () => {
            fetchMapData()
          },
          60 * 60 * 1000,
      )

      return () => clearInterval(hourlyInterval)
    }, msUntilNextHour)

    return () => clearTimeout(initialTimer)
  }, [showContent, fetchMapData])

  // Handle ranking sidebar
  const handleRankingClick = () => {
    if (!showRanking) {
      fetchRankingData(); // 패널 열 때 실제 API 호출
    }
    setShowRanking(!showRanking);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 relative overflow-hidden">
        <SnowfallBackground />

        {showIntro && (
            <IntroAnimation
                onComplete={() => {
                  setShowContent(true)
                }}
            />
        )}

        {showContent && (
            <div
                className="relative z-10"
                style={{
                  animation: "glassWipe 1s ease-out forwards",
                }}
            >
              {/* Header */}
              <header className="pt-12 pb-8 text-center">
                <h1
                    className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-300 mb-2"
                    style={{
                      textShadow: "0 0 30px rgba(56, 189, 248, 0.2)",
                    }}
                >
                  눈 ON
                </h1>
                <p className="text-muted-foreground text-lg">실시간 대한민국 강설 현황</p>
              </header>

              {/* Main content */}
              <main className="container mx-auto px-4 pb-20">
                <div
                    className="space-y-12"
                    style={{
                      animation: "fadeInUp 0.8s ease-out 0.3s backwards",
                    }}
                >
                  {/* Search bar */}
                  <div className="max-w-2xl mx-auto">
                    <SearchBar onSearch={handleSearch} />
                  </div>

                  {/* Error message */}
                  {error && (
                      <div className="max-w-2xl mx-auto glass-strong rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                  )}

                  {/* Map */}
                  <div
                      className="max-w-4xl mx-auto"
                      style={{
                        animation: "fadeInUp 0.8s ease-out 0.5s backwards",
                      }}
                  >
                    <KoreaMap cities={cities} onCityClick={setSelectedCity} />
                  </div>
                </div>
              </main>

              {/* Ranking button */}
              <Button
                  onClick={handleRankingClick}
                  size="lg"
                  className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-xl bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 z-30"
              >
                <TrendingUp className="w-6 h-6" />
              </Button>

              {/* City modal */}
              <CityModal
                  // selectedCity가 SearchWeatherResult 타입이라고 가정
                  cityName={selectedCity?.cityName || ""}
                  // weatherStatus 대신 ptyCode 또는 가공된 문자열 전달 고려
                  weatherStatus={selectedCity?.weatherStatus ? mapWeatherStatusToKorean(selectedCity.weatherStatus) : ""}
                  isOpen={!!selectedCity}
                  onClose={() => setSelectedCity(null)}
              />

              {/* Ranking sidebar */}
              <RankingSidebar cities={rankingCities} isOpen={showRanking} onClose={() => setShowRanking(false)} />
            </div>
        )}
      </div>
  )
}

function mapWeatherStatusToKorean(status: string): string {
  switch (status) {
    case 'CLEAR': return '맑음';
    case 'RAIN': return '비';
    case 'RAIN_SNOW': return '비 또는 눈';
    case 'SNOW': return '눈';
    case 'RAIN_DROP': return '빗방울';
    case 'RAIN_SNOW_FLURRY': return '빗방울/눈날림';
    case 'SNOW_FLURRY': return '눈날림';
    case 'UNKNOWN': return '정보 없음';
    default: return status; // 알 수 없는 경우 원본 반환
  }
}
