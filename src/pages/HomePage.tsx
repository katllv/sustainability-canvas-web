import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function HomePage() {
    return (
        <div className="p-8">
            <h1 className="mb-4">Sustainability Canvas</h1>
            <Button>Test Button</Button>
            <Button variant="outline" className="ml-4">Outline Button</Button>
            <Button variant="ghost" className="ml-4">Ghost Button</Button>
            <div className="mt-8 flex flex-col gap-4">
                <div className="w-20 h-20 bg-the-light-blue"></div>
                <div className="w-20 h-20 bg-the-green"></div>
                <div className="w-20 h-20 bg-the-orange"></div>
                <div className="w-20 h-20 bg-the-lavender"></div>
                <div className="w-20 h-20 bg-the-yellow"></div>
                <div className="w-20 h-20 bg-the-dark-blue"></div>
                <div className="w-20 h-20 bg-the-light-grey"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="gap-4 flex flex-col">
                    <Card className="bg-the-light-blue">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Text here hello</p>
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                    <Card className="bg-the-light-blue">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Text here hello</p>
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                </div>
                <div className="gap-4 flex flex-col">
                    <Card className="bg-the-light-blue">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Text here hello</p>
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                    <Card className="bg-the-light-blue">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Text here hello</p>
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                </div>
                <div className="gap-4 flex flex-col">
                    <Card className="bg-the-light-blue">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Text here hello</p>
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                    <Card className="bg-the-light-blue">
                        <CardHeader>
                            <CardTitle>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Text here hello</p>
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}