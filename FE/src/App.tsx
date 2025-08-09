import { useState } from "react";
import { Container, Card, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import HeaderBar from "./components/HeaderBar";
import TextModerationForm from "./components/TextModerationForm";
import ModerationResult from "./components/ModerationResult";
import HistoryList, { type HistoryItem } from "./components/HistoryList";
import ResultSkeleton from "./components/ResultSkeleton";
import HistorySkeleton from "./components/HistorySkeleton";
import { moderateText, type ModerationResp } from "./libs/api";

export default function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastInput, setLastInput] = useState("");

  const { mutate, data, isPending, isError, error } = useMutation<
    ModerationResp,
    Error,
    string
  >({
    mutationFn: (t: string) => moderateText(t),
    onMutate: () => {
      // có thể show loading toast nhẹ nếu thích
    },
    onSuccess: (resp, variables) => {
      setLastInput(variables);
      setHistory((prev) => [{ text: variables, allowed: resp.allowed, reasons: resp.reasons }, ...prev].slice(0, 10));

      notifications.show({
        title: resp.allowed ? "Được duyệt" : "Bị chặn",
        message: resp.allowed
          ? "Bình luận không phát hiện vi phạm."
          : `Vi phạm: ${resp.reasons.join(", ") || "unknown"}`,
        color: resp.allowed ? "green" : "red",
      });
    },
    onError: (err) => {
      notifications.show({
        title: "Lỗi kiểm duyệt",
        message: err.message || "Request failed",
        color: "red",
      });
    },
  });

  return (
    <Container size="sm" py="xl">
      <HeaderBar />

      <TextModerationForm
        loading={isPending}
        onSubmit={(t) => mutate(t)}
        hasHistory={history.length > 0}
        onClearHistory={() => setHistory([])}
      />

      {/* Loading state -> Skeleton đẹp */}
      {isPending && (
        <>
          <ResultSkeleton />
          <HistorySkeleton />
        </>
      )}

      {isError && (
        <Card withBorder mt="lg">
          <Text c="red">Lỗi: {error.message}</Text>
        </Card>
      )}

      {data && !isPending && (
        <ModerationResult originalText={lastInput} resp={data} showDebug />
      )}

      {!isPending && <HistoryList items={history} onRemove={(i) => setHistory((p) => p.filter((_, idx) => idx !== i))} />}
    </Container>
  );
}
