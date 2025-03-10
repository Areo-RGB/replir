import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { NormativeData, AthleteResult } from "../data";
import { cn } from "@/lib/utils";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface NormativeDataViewProps {
  normativeData: NormativeData[];
  athleteResults: AthleteResult[];
  selectedAthlete: string;
}

export default function NormativeDataView({
  normativeData,
  athleteResults,
  selectedAthlete,
}: NormativeDataViewProps) {
  const [datasetType, setDatasetType] = useState<"Leistung" | "Motorik">(
    "Leistung",
  );
  const [selectedTest, setSelectedTest] = useState("");

  useEffect(() => {
    const filteredData = normativeData.filter((data) => {
      if (datasetType === "Motorik") {
        return data.test.includes("DMT");
      }
      return !data.test.includes("DMT");
    });
    setSelectedTest(filteredData[0]?.test || "");
  }, [datasetType, normativeData]);

  const getPercentileForValue = (
    values: number[],
    value: number,
    lowerIsBetter: boolean = false,
  ): number => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const index = sortedValues.findIndex((v) => v >= value);

    if (lowerIsBetter) {
      return Math.round(
        ((sortedValues.length - 1 - index) / (sortedValues.length - 1)) * 100,
      );
    }

    return Math.round((index / (sortedValues.length - 1)) * 100);
  };

  const getRatingForPercentile = (
    ratings: NormativeData["ratings"],
    percentile: number,
  ): string => {
    const rating = ratings.find(
      (r) => percentile >= r.range[0] && percentile <= r.range[1],
    );
    return rating?.label || "nicht bewertet";
  };

  const getRatingColor = (rating: string): string => {
    switch (rating) {
      case "ausgezeichnet (A)":
        return "bg-emerald-500";
      case "sehr gut (A)":
        return "bg-green-500";
      case "gut (A)":
        return "bg-blue-500";
      case "durchschnittlich (B)":
        return "bg-yellow-500";
      case "unterdurchschnittlich (C)":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTestRatings = () => {
    const filteredData = normativeData.filter((data) => {
      if (datasetType === "Motorik") {
        return data.test.includes("DMT");
      }
      return !data.test.includes("DMT");
    });

    return filteredData.map((testData) => {
      const testName = testData.test; // Use the full test name from normativeData
      const athleteResult = athleteResults.find(
        (r) =>
          r.test === testName.replace(" DMT", "") &&
          r.athlete === selectedAthlete,
      );

      const percentile = athleteResult
        ? getPercentileForValue(
            testData.values,
            athleteResult.result,
            testData.lowerIsBetter,
          )
        : null;

      const rating =
        percentile !== null
          ? getRatingForPercentile(testData.ratings, percentile)
          : "";

      return {
        test: testData.test.replace(" DMT", ""), // Display without "DMT" for consistency
        rating,
        percentile,
        result: athleteResult?.result,
        unit: testData.unit,
      };
    });
  };

  const renderChart = (testData: NormativeData) => {
    const testName = testData.test; // Use the full test name
    const athleteResult = athleteResults.find(
      (r) =>
        r.test === testName.replace(" DMT", "") &&
        r.athlete === selectedAthlete,
    );

    const percentiles = Array.from({ length: 11 }, (_, i) => i * 10);
    const sortedValues = [...testData.values].sort((a, b) => a - b);

    const normativeValues = percentiles.map((p) => {
      let index;
      if (testData.lowerIsBetter) {
        index = Math.floor(((100 - p) / 100) * (sortedValues.length - 1));
      } else {
        index = Math.floor((p / 100) * (sortedValues.length - 1));
      }
      return sortedValues[index];
    });

    const options = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Percentile",
            color: "rgb(107, 114, 128)",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        y: {
          title: {
            display: true,
            text: testData.unit,
            color: "rgb(107, 114, 128)",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.parsed.y} ${testData.unit}`,
          },
        },
      },
    };

    const data = {
      labels: percentiles,
      datasets: [
        {
          label: "Normative Range",
          data: normativeValues,
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          tension: 0.4,
        },
        ...(athleteResult
          ? [
              {
                label: "Athlete",
                data: Array(11).fill(athleteResult.result),
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.5)",
                borderDash: [5, 5],
                pointStyle: "circle",
              },
            ]
          : []),
      ],
    };

    return { options, data };
  };

  const testRatings = getTestRatings();
  const filteredNormativeData = normativeData.filter((data) => {
    if (datasetType === "Motorik") {
      return data.test.includes("DMT");
    }
    return !data.test.includes("DMT");
  });

  const currentTest = filteredNormativeData.find(
    (data) => data.test === selectedTest,
  );
  const { options, data } = currentTest
    ? renderChart(currentTest)
    : { options: {}, data: { datasets: [] } };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6">
        {/* Clickable Logos for Filter */}
        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/de/c/c0/DFB-Logo.svg"
            alt="Leistungsdiagnostik Logo"
            className={`h-8 cursor-pointer ${datasetType === "Leistung" ? "opacity-100" : "opacity-50"}`}
            onClick={() => setDatasetType("Leistung")}
          />
          <img
            src="https://i.imgur.com/CVNGfEc.png"
            alt="Motorik Test Logo"
            className={`h-8 cursor-pointer ${datasetType === "Motorik" ? "opacity-100" : "opacity-50"}`}
            onClick={() => setDatasetType("Motorik")}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {datasetType === "Motorik"
            ? "Deutscher Motorik Test"
            : "Leistungsdiagnostik"}
        </h3>
      </div>

      {/* Chart and KPIs Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="h-[400px]">
          <div className="mb-4">
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {filteredNormativeData.map((test) => (
                <option key={test.test} value={test.test}>
                  {test.test.replace(" DMT", "")}
                </option>
              ))}
            </select>
          </div>

          <div className="h-[400px]">
            <Line options={options} data={data} />
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-1 w-4 bg-indigo-500 rounded"></div>
              <span>Normative Range</span>
              <div className="h-1 w-4 border-t-2 border-red-500 border-dashed"></div>
              <span>Athlete Result</span>
            </div>
          </div>
        </div>

        {/* KPIs Section */}
        <div className="space-y-4">
          {testRatings.map((rating, index) => {
            const pairIndex = Math.floor(index / 2);
            if (index % 2 === 0) {
              return (
                <div key={rating.test} className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {rating.test}
                      </span>
                      {rating.result !== undefined && (
                        <span className="text-sm font-medium text-gray-900 tabular-nums">
                          {rating.result} {rating.unit}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {datasetType === "Leistung" && rating.rating && (
                        <div
                          className={`px-2 py-1 rounded-full text-white text-xs ${getRatingColor(rating.rating)}`}
                        >
                          {rating.rating}
                        </div>
                      )}
                      {rating.percentile !== null && (
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-gray-500 cursor-help">
                                <Info className="h-3.5 w-3.5" />
                                Percentile: {rating.percentile}%
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">
                                {rating.percentile === 100
                                  ? "Besser als alle Vergleichswerte"
                                  : rating.percentile === 0
                                    ? "Unter allen Vergleichswerten"
                                    : `Besser als ${rating.percentile}% der Vergleichswerte`}
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  {testRatings[index + 1] && (
                    <div className="p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {testRatings[index + 1].test}
                        </span>
                        {testRatings[index + 1].result !== undefined && (
                          <span className="text-sm font-medium text-gray-900 tabular-nums">
                            {testRatings[index + 1].result}{" "}
                            {testRatings[index + 1].unit}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        {datasetType === "Leistung" &&
                          testRatings[index + 1].rating && (
                            <div
                              className={`px-2 py-1 rounded-full text-white text-xs ${getRatingColor(testRatings[index + 1].rating)}`}
                            >
                              {testRatings[index + 1].rating}
                            </div>
                          )}
                        {testRatings[index + 1].percentile !== null && (
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-xs text-gray-500 cursor-help">
                                  <Info className="h-3.5 w-3.5" />
                                  Percentile:{" "}
                                  {testRatings[index + 1].percentile}%
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm">
                                  {testRatings[index + 1].percentile === 100
                                    ? "Besser als alle Vergleichswerte"
                                    : testRatings[index + 1].percentile === 0
                                      ? "Unter allen Vergleichswerten"
                                      : `Besser als ${testRatings[index + 1].percentile}% der Vergleichswerte`}
                                </p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return null; // Only render for even indices to avoid duplicate pairs
          })}
        </div>
      </div>
    </div>
  );
}
