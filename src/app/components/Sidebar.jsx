"use client";
import { Link } from "lucide-react";
import Card from "./Card"
// import { useState } from "react";

export default function Sidebar() {
    return (
        <div className="border border-black">
            <h1>Your Projects</h1>
            <Link href="">
                <Card>
                    <div>
                        <h3>Project: name</h3>
                        <h5>Tester: name</h5>
                        <h5>Developer: name</h5>
                    </div>
                </Card>
            </Link>
            <Card>
                <div>
                    <h3>Project: name</h3>
                    <h5>Tester: name</h5>
                    <h5>Developer: name</h5>
                </div>
            </Card>
            <Card>
                <div>
                    <h3>Project: name</h3>
                    <h5>Tester: name</h5>
                    <h5>Developer: name</h5>
                </div>
            </Card>
            <Card>
                <div>
                    <h3>Project: name</h3>
                    <h5>Tester: name</h5>
                    <h5>Developer: name</h5>
                </div>
            </Card>
        </div>
    )
}