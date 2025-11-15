"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import URLShortenerTab from "@/components/url-shortener-tab";
import QRGeneratorTab from "@/components/qr-generator-tab";
import UserHistory from "@/components/user-history";
import DomainModal from "@/components/domain-modal";

interface MainToolsProps {
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

export default function MainTools({
  isLoggedIn,
  onLoginRequired,
}: MainToolsProps) {
  const [activeTab, setActiveTab] = useState("url");
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="url">URL Shortener</TabsTrigger>
            <TabsTrigger value="qr">QR Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="url">
            <URLShortenerTab
              isLoggedIn={isLoggedIn}
              onLoginRequired={onLoginRequired}
              onAddDomain={() => setIsDomainModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="qr">
            <QRGeneratorTab
              isLoggedIn={isLoggedIn}
              onLoginRequired={onLoginRequired}
            />
          </TabsContent>
        </Tabs>

        {isLoggedIn && <UserHistory activeTab={activeTab} />}

        {!isLoggedIn && (
          <div className="text-center mt-12 p-8 bg-card rounded-lg border border-border">
            <p className="text-lg text-muted-foreground mb-4">
              {activeTab === "url"
                ? "Sign in to see your past shortened URLs"
                : "Sign in to see your past generated QR codes"}
            </p>
            <Button onClick={onLoginRequired}>Sign In</Button>
          </div>
        )}
      </div>

      <DomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />
    </section>
  );
}
