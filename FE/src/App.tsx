import { useState } from "react";
import { Container, Group, Loader, Text, Card } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import HeaderBar from "./components/HeaderBar";
import TextModerationForm from "./components/TextModerationForm"
import ModerationResult from "./components/ModerationResult";
import HistoryList, { type HistoryItem } from "./components/HistoryList";
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
    onSuccess: (resp, variables) => {
      setLastInput(variables);
      setHistory((prev) => [{ text: variables, allowed: resp.allowed, reasons: resp.reasons }, ...prev].slice(0, 10));
    },
  });

  const handleSubmit = (text: string) => mutate(text);

  const removeHistoryItem = (index: number) =>
    setHistory((prev) => prev.filter((_, i) => i !== index));

  return (
    <Container size="sm" py="xl">
      <HeaderBar />

      <TextModerationForm
        loading={isPending}
        onSubmit={handleSubmit}
        hasHistory={history.length > 0}
        onClearHistory={() => setHistory([])}
      />

      {isPending && (
        <Group mt="md">
          <Loader size="sm" /> <Text>Đang kiểm tra...</Text>
        </Group>
      )}

      {isError && (
        <Card withBorder mt="lg">
          <Text c="red">Lỗi: {error.message}</Text>
        </Card>
      )}

      {data && (
        <ModerationResult originalText={lastInput} resp={data} showDebug />
      )}

      <HistoryList items={history} onRemove={removeHistoryItem} />
    </Container>
  );
}
